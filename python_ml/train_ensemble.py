import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib
import os

from preprocess import load_and_preprocess
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.neighbors import KNeighborsClassifier

print("ENSEMBLE TRAINING")


# ---------------- PATH SETUP ----------------
os.makedirs("model", exist_ok=True)
MODEL_PATH = os.path.join("model", "ensemble_model.pkl")
SCALER_PATH = os.path.join("model", "scaler.pkl")

FEATURES = [
    "duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes",
    "land", "wrong_fragment", "urgent", "hot", "num_failed_logins",
    "num_compromised", "root_shell", "su_attempted", "num_root",
    "num_file_creations", "num_shells", "num_access_files", "is_guest_login", "count"
]

# ---------------- LOAD DATA ----------------
X_train, y_train = load_and_preprocess(
    "data/KDDTrain.parquet",
    is_train=True
)

# ---------------- SCALE ----------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_train_scaled = pd.DataFrame(X_train_scaled, columns=FEATURES)  # Keep column names

# ---------------- DEFINE MODELS ----------------
knn = KNeighborsClassifier(
    n_neighbors=11,
    weights="distance",
    metric="manhattan",
    n_jobs=-1
)

rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=20,
    class_weight="balanced",
    n_jobs=-1,
    random_state=42
)

# ---------------- ENSEMBLE ----------------
ensemble = VotingClassifier(
    estimators=[("knn", knn), ("rf", rf)],
    voting="soft"  # allows predict_proba for live thresholding
)

# ---------------- TRAIN ----------------
print("🔹 Training ensemble model...")
ensemble.fit(X_train_scaled, y_train)

# ---------------- SAVE ----------------
joblib.dump(ensemble, MODEL_PATH)
joblib.dump(scaler, SCALER_PATH)

print("Ensemble model saved at:", MODEL_PATH)
print(" Scaler saved at:", SCALER_PATH)