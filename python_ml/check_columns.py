import pandas as pd

df = pd.read_parquet("data/KDDTrain.parquet")

print("Total Columns:", len(df.columns))
print("\nColumns:\n")
for col in df.columns:
    print(col)