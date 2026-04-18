import joblib
from preprocess import load_and_preprocess
from sklearn.neighbors import KNeighborsClassifier
from imblearn.over_sampling import SMOTE
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "knn_model.pkl")


print("KNN TRAINING WITH SMOTE")


# Load data
X_train, y_train = load_and_preprocess(
    "data/KDDTrain.parquet",
    is_train=True
)


print("Applying SMOTE...")
smote = SMOTE(random_state=42)
X_train, y_train = smote.fit_resample(X_train, y_train)


model = KNeighborsClassifier(
    n_neighbors=9,
    weights="distance",
    metric="manhattan",
    n_jobs=-1
)

print("🔹 Training model...")
model.fit(X_train, y_train)

joblib.dump(model, MODEL_PATH)

print(" Model saved at:", MODEL_PATH)