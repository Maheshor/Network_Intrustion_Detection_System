import sys
import json
import joblib
import pandas as pd
from preprocess import preprocess_live

MODEL_PATH = "model/rf_model.pkl"

model = joblib.load(MODEL_PATH)

def predict(data):
    df = pd.DataFrame([data])
    X = preprocess_live(df)

    pred = model.predict(X)[0]

    return {
        "prediction": int(pred),
        "label": "ATTACK" if pred == 1 else "NORMAL"
    }

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    result = predict(input_data)
    print(json.dumps(result))
