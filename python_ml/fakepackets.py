# fakepackets_demo.py
import time
import random
import json
import websocket
from live_nids import preprocess_for_prediction, model

# ---------------- CONFIG ----------------
BASE_SRC_IP = "192.168.1."
TARGET_IP = "192.168.1.4"

NUM_NORMAL = 20        
NUM_THREATS = 50       # number of threat packets to simulate
INTERLEAVED_NORMALS = 4  # number of random normal packets during threat spam
DEMO_THRESHOLD = 0.5   # model probability threshold for "THREAT"

PACKET_DELAY = 0.5     # seconds between packets

# ---------------- WEBSOCKET ----------------
def connect_ws():
    while True:
        try:
            ws = websocket.WebSocket()
            ws.connect("ws://localhost:5000")
            print(" WebSocket connected")
            return ws
        except Exception as e:
            print(" WebSocket connection failed, retrying in 1 sec...", e)
            time.sleep(1)

ws = connect_ws()

# ---------------- PACKET GENERATION ----------------
def generate_packet(threat=False):
    """Generate a fake packet. 'threat=True' for threat-like features."""
    src_ip = BASE_SRC_IP + str(random.randint(2, 254))
    features = {
        "duration": round(random.uniform(0.05, 0.2), 3),
        "protocol_type": "icmp" if threat else "tcp",
        "service": "other",
        "flag": "REJ" if threat else "SF",
        "src_bytes": random.randint(1000, 5000) if threat else random.randint(0, 1000),
        "dst_bytes": 0 if threat else random.randint(0, 100),
        "land": 1 if threat else 0,
        "wrong_fragment": 1 if threat else 0,
        "urgent": 1 if threat else 0,
        "hot": random.randint(1, 5) if threat else 0,
        "num_failed_logins": random.randint(0, 3) if threat else 0,
        "num_compromised": 1 if threat else 0,
        "root_shell": 1 if threat else 0,
        "su_attempted": 1 if threat else 0,
        "num_root": 1 if threat else 0,
        "num_file_creations": 1 if threat else 0,
        "num_shells": 1 if threat else 0,
        "num_access_files": 1 if threat else 0,
        "is_guest_login": 1 if threat else 0,
        "count": random.randint(5, 20) if threat else random.randint(0, 5)
    }
    return src_ip, TARGET_IP, features

# ---------------- SEND PACKET ----------------
def send_packet(src, dst, features):
    global ws
    df_scaled = preprocess_for_prediction(features)
    prob_threat = model.predict_proba(df_scaled)[0][1]
    label = "THREAT" if prob_threat >= DEMO_THRESHOLD else "NORMAL"

    data = {
        "timestamp": time.strftime("%H:%M:%S"),
        "src": src,
        "dst": dst,
        "prediction_prob": float(prob_threat),
        "label": label
    }

    # Print & send
    print(f" Packet | {json.dumps(data)}")
    try:
        if ws is None or ws.connected is False:
            ws = connect_ws()
        ws.send(json.dumps(data))
    except Exception as e:
        print("WebSocket error, reconnecting...", e)
        ws = connect_ws()
        ws.send(json.dumps(data))

# ---------------- DEMO SIMULATION ----------------
print(" Starting Demo Threat Simulation...")

# Step 1: Normal packets first
for i in range(NUM_NORMAL):
    src, dst, features = generate_packet(threat=False)
    send_packet(src, dst, features)
    time.sleep(PACKET_DELAY)

# Step 2: Threat packets with interleaved normal packets
for i in range(NUM_THREATS):
    # Occasionally insert a normal packet during threat spam
    if INTERLEAVED_NORMALS > 0 and random.random() < INTERLEAVED_NORMALS / NUM_THREATS:
        src, dst, features = generate_packet(threat=False)
    else:
        src, dst, features = generate_packet(threat=True)

    send_packet(src, dst, features)
    time.sleep(PACKET_DELAY)

print(" Demo Threat Simulation Completed")