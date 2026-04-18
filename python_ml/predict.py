import sys
import json
import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model", "knn_tuned.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "model", "encoders.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "model", "scaler.pkl")

FEATURES = [
    "duration",
    "protocol_type",
    "service",
    "flag",
    "src_bytes",
    "dst_bytes"
]

# Load once
model = joblib.load(MODEL_PATH)
encoders = joblib.load(ENCODER_PATH)
scaler = joblib.load(SCALER_PATH)

def preprocess_live(data):

    df = pd.DataFrame([data])

    # Encode categorical
    for col in ["protocol_type","service","flag"]:
        le = encoders[col]
        df[col] = df[col].map(
            lambda v: le.transform([str(v)])[0]
            if str(v) in le.classes_ else -1
        )

    # Scale all features
    df = pd.DataFrame(
        scaler.transform(df[FEATURES]),
        columns=FEATURES
    )

    return df

def predict_intrusion(input_data):

    X = preprocess_live(input_data)

    pred = model.predict(X)[0]

    return {
        "prediction": int(pred),
        "label": "Intrusion Detected" if pred == 1 else "Normal Traffic"
    }

# ================= ENTRY =================
if __name__ == "__main__":

    try:
        # Read JSON from stdin
        input_json = json.loads(sys.stdin.read())
        result = predict_intrusion(input_json)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({
            "error": str(e)
        }))
