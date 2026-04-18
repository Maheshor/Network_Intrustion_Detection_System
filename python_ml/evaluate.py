import joblib
from preprocess import load_and_preprocess
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "knn_model.pkl")

print("🔹 Loading test data...")

X_test, y_test = load_and_preprocess(
    "data/KDDTest.parquet",
    is_train=False
)

print("🔹 Loading model...")
model = joblib.load(MODEL_PATH)

print("🔹 Predicting...")
y_pred = model.predict(X_test)

print("\n==============================")
print("📊 MODEL EVALUATION")
print("==============================")

print("✅ Accuracy :", round(accuracy_score(y_test, y_pred), 4))

print("\n📊 Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\n📄 Classification Report:")
print(classification_report(y_test, y_pred))