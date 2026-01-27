import sys
import json
import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model", "knn_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "model", "scaler.pkl")

FEATURES = [
    "duration",
    "protocol_type",
    "service",
    "flag",
    "src_bytes",
    "dst_bytes"
]

def predict_intrusion(input_data):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    df = pd.DataFrame([input_data], columns=FEATURES)

    # Encode categorical values manually (SAME AS TRAINING)
    categorical_map = {
        "protocol_type": {"tcp": 0, "udp": 1, "icmp": 2},
        "service": {"http": 0, "ftp": 1, "smtp": 2, "other": 3},
        "flag": {"SF": 0, "S0": 1, "REJ": 2, "RSTO": 3}
    }

    for col, mapping in categorical_map.items():
        df[col] = df[col].map(mapping).fillna(0)

    df[["duration", "src_bytes", "dst_bytes"]] = scaler.transform(
        df[["duration", "src_bytes", "dst_bytes"]]
    )

    prediction = model.predict(df)[0]
    return "Intrusion Detected" if prediction == 1 else "Normal Traffic"


# =========================
# ENTRY POINT
# =========================
if __name__ == "__main__":

    # 🔹 API MODE
    if len(sys.argv) > 1:
        input_json = json.loads(sys.argv[1])
        result = predict_intrusion(input_json)
        print(result)

    # 🔹 TEST MODE (NO ARGUMENT)
    else:
        test_sample = {
            "duration": 0,
            "protocol_type": "tcp",
            "service": "http",
            "flag": "SF",
            "src_bytes": 181,
            "dst_bytes": 5450
        }

        print("🔍 Test Prediction:", predict_intrusion(test_sample))
