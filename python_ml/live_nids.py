import os
import time
import json
import joblib
import pandas as pd
import websocket
import threading
import queue
import warnings
import random
import socket

from scapy.all import sniff, IP, TCP, UDP

warnings.filterwarnings("ignore", category=UserWarning)

# ---------------- NETWORK CHECK ----------------
def check_internet():
    try:
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        return True
    except OSError:
        return False

# ---------------- PATHS ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "ensemble_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "model", "scaler.pkl")

# ---------------- LOAD MODEL ----------------
print("Loading Ensemble Model...")
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# ---------------- SCAN ID ----------------
SCAN_ID = "scan_" + str(int(time.time()))
print(f"Scan ID: {SCAN_ID}")

# ---------------- FEATURES ----------------
FEATURES = [
    "duration","protocol_type","service","flag","src_bytes","dst_bytes",
    "land","wrong_fragment","urgent","hot","num_failed_logins",
    "num_compromised","root_shell","su_attempted","num_root",
    "num_file_creations","num_shells","num_access_files","is_guest_login","count"
]

PROTOCOL_MAP = {"tcp": 0, "udp": 1, "icmp": 2}
SERVICE_MAP = {"http": 0, "ftp": 1, "other": 2}
FLAG_MAP = {"SF": 0, "S0": 1, "REJ": 2, "RSTO": 3, "RSTR": 4, "SH": 5, "OTH": 6}

# ---------------- WEBSOCKET ----------------
ws_queue = queue.Queue()
ws = None

def connect_ws():
    try:
        w = websocket.WebSocket()
        w.connect("ws://localhost:5000")
        print("WebSocket connected")
        return w
    except Exception as e:
        print("WebSocket connection failed:", e)
        return None

def ws_sender():
    global ws
    while True:
        data = ws_queue.get()

        if ws is None:
            ws = connect_ws()
            while ws is None:
                time.sleep(3)
                ws = connect_ws()

        try:
            ws.send(json.dumps(data))
        except:
            ws = None
            ws_queue.put(data)

threading.Thread(target=ws_sender, daemon=True).start()

# ---------------- FLOW STORAGE ----------------
flows = {}

# ---------------- FEATURE EXTRACTION ----------------
def extract_features(pkt):
    if IP not in pkt:
        return None

    src = pkt[IP].src
    dst = pkt[IP].dst
    proto = pkt[IP].proto

    key = (src, dst, proto)

    if key not in flows:
        flows[key] = {"start": time.time(), "count": 0, "src_bytes": 0}

    flow = flows[key]
    flow["count"] += 1
    flow["src_bytes"] += len(pkt)

    duration = time.time() - flow["start"]

    protocol_type = "tcp" if TCP in pkt else "udp" if UDP in pkt else "icmp"

    service = "other"
    if TCP in pkt:
        if pkt[TCP].dport == 80:
            service = "http"
        elif pkt[TCP].dport == 21:
            service = "ftp"

    # ---------------- FLAG LOGIC ----------------
    if flow["count"] < 20:
        flag = "SF"
    elif flow["count"] < 40:
        flag = "S0"
    else:
        flag = "REJ"

    # ---------------- FLOW RESET ----------------
    if flow["count"] > 60:
        flows[key] = {"start": time.time(), "count": 0, "src_bytes": 0}

    # ---------------- FEATURES ----------------
    features = {
        "duration": duration,
        "protocol_type": protocol_type,
        "service": service,
        "flag": flag,
        "src_bytes": flow["src_bytes"],
        "dst_bytes": 0,
        "land": 0,
        "wrong_fragment": 0,
        "urgent": 0,
        "hot": random.randint(0, 2),
        "num_failed_logins": random.randint(0, 1),
        "num_compromised": 0,
        "root_shell": 0,
        "su_attempted": 0,
        "num_root": 0,
        "num_file_creations": 0,
        "num_shells": 0,
        "num_access_files": 0,
        "is_guest_login": 0,
        "count": flow["count"]
    }

    return features, src, dst

# ---------------- PREPROCESS ----------------
def preprocess_for_prediction(features_dict):
    features_dict["protocol_type"] = PROTOCOL_MAP.get(features_dict["protocol_type"], 2)
    features_dict["service"] = SERVICE_MAP.get(features_dict["service"], 2)
    features_dict["flag"] = FLAG_MAP.get(features_dict["flag"], 6)

    df = pd.DataFrame([features_dict], columns=FEATURES)
    return scaler.transform(df)

# ---------------- ANALYZE ----------------
THRESHOLD = 0.75

def analyze(pkt):
    result = extract_features(pkt)
    if not result:
        return

    features, src, dst = result

    df_scaled = preprocess_for_prediction(features)

    prob = model.predict_proba(df_scaled)[0][1]
    label = "THREAT" if prob >= THRESHOLD else "NORMAL"

    data = {
        "timestamp": time.strftime("%H:%M:%S"),
        "src": src,
        "dst": dst,
        "prediction_prob": float(prob),
        "label": label,
        "scanId": SCAN_ID
    }

    print(data)

    ws_queue.put(data)

# ---------------- START ----------------
print("Checking network connectivity...")

if not check_internet():
    print("No internet access. Please check your network connectivity.")
    exit()

print("Network detected. Starting Live NIDS...")

try:
    sniff(prn=analyze, store=False)
except KeyboardInterrupt:
    print("Stopped by user")

print("NIDS stopped")