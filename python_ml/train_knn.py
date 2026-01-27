from preprocess import load_and_preprocess
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.utils import resample
import joblib

print("🔹 Loading training data...")
X, y = load_and_preprocess("data/KDDTrain.parquet", is_train=True)

# ---------------- BALANCING ----------------
X["label"] = y

normal = X[X["label"] == 0]
attack = X[X["label"] == 1]

normal_downsampled = resample(
    normal,
    replace=False,
    n_samples=len(attack),
    random_state=42
)

balanced = pd.concat([normal_downsampled, attack])
balanced = balanced.sample(frac=1, random_state=42)

y_balanced = balanced["label"]
X_balanced = balanced.drop(columns=["label"])

print("Balanced class counts:")
print(y_balanced.value_counts())

# ---------------- TRAIN MODEL ----------------
print("🔹 Training KNN model (k=3)...")

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_balanced, y_balanced)

joblib.dump(knn, "model/knn_model.pkl")

print("✅ KNN model trained and saved successfully")
