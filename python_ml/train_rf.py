import joblib
from preprocess import load_and_preprocess
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

print("===================================")
print("🚀 RANDOM FOREST TRAINING STARTED")
print("===================================")

# Load training data
print("🔹 Loading training data...")
X_train, y_train = load_and_preprocess(
    "data/KDDTrain.parquet",
    is_train=True
)

# Verify feature count
print("🔹 Feature count:", X_train.shape[1])
print("🔹 Training samples:", X_train.shape[0])

print("\n🔹 Training RandomForest model...")

# Random Forest model
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=20,
    min_samples_split=5,
    class_weight="balanced",
    n_jobs=-1,
    random_state=42
)

# Train model
model.fit(X_train, y_train)

print("✅ Training completed")

# Quick training accuracy check
train_pred = model.predict(X_train)
train_acc = accuracy_score(y_train, train_pred)

print(f"📊 Training Accuracy: {train_acc:.4f}")

# Save model
MODEL_PATH = "model/rf_model.pkl"
joblib.dump(model, MODEL_PATH)

print(f"💾 Model saved to: {MODEL_PATH}")

print("===================================")
print("🎯 TRAINING FINISHED SUCCESSFULLY")
print("===================================")