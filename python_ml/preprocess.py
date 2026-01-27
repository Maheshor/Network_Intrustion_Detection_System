import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder, StandardScaler

FEATURES = [
    "duration",
    "protocol_type",
    "service",
    "flag",
    "src_bytes",
    "dst_bytes"
]

ENCODER_PATH = "model/encoders.pkl"
SCALER_PATH = "model/scaler.pkl"

def load_and_preprocess(file_path, is_train=True):
    df = pd.read_parquet(file_path)

    X = df[FEATURES].copy()

    categorical_cols = ["protocol_type", "service", "flag"]

    if is_train:
        encoders = {}

        for col in categorical_cols:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str)).astype("int32")
            encoders[col] = le

        joblib.dump(encoders, ENCODER_PATH)

        scaler = StandardScaler()
        X = pd.DataFrame(
            scaler.fit_transform(X),
            columns=FEATURES
        )

        joblib.dump(scaler, SCALER_PATH)

        y = df["class"].apply(lambda x: 0 if x == "normal" else 1)

        return X, y

    else:
        encoders = joblib.load(ENCODER_PATH)

        for col in categorical_cols:
            le = encoders[col]
            X[col] = X[col].map(
                lambda v: le.transform([str(v)])[0]
                if str(v) in le.classes_ else -1
            ).astype("int32")

        scaler = joblib.load(SCALER_PATH)
        X = pd.DataFrame(
            scaler.transform(X),
            columns=FEATURES
        )

        return X
