import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCALER_PATH = os.path.join(BASE_DIR, "model/scaler.pkl")

FEATURES = [
    "duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes",
    "land", "wrong_fragment", "urgent", "hot", "num_failed_logins",
    "num_compromised", "root_shell", "su_attempted", "num_root",
    "num_file_creations", "num_shells", "num_access_files", "is_guest_login", "count"
]

def load_and_preprocess(path, is_train=True):
    df = pd.read_parquet(path)

    # Binary classification
    y = df["class"].apply(lambda x: 0 if x == "normal" else 1)
    X = df[FEATURES].copy()

    # Encode categorical
    X["protocol_type"] = X["protocol_type"].map({"tcp": 0, "udp": 1, "icmp": 2})
    X["service"] = X["service"].astype("category").cat.codes
    X["flag"] = X["flag"].astype("category").cat.codes

    scaler = StandardScaler()
    if is_train:
        X = scaler.fit_transform(X)
        joblib.dump(scaler, SCALER_PATH)
    else:
        scaler = joblib.load(SCALER_PATH)
        X = scaler.transform(X)

    return X, y