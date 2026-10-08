import sys
import pandas as pd
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

df = pd.read_csv('data/raw/tenders_manipur.csv')

print("=" * 60)
print("CHEIRAP AI - TENDERS CSV QUALITY & INTEGRITY SCAN")
print("=" * 60)
print(f"Total Rows: {len(df)}")
print(f"Total Columns: {len(df.columns)}")
print(f"Columns: {df.columns.tolist()}\n")

print("--- NULL / MISSING VALUES ---")
nulls = df.isnull().sum()
for col, cnt in nulls.items():
    if cnt > 0:
        print(f"  {col}: {cnt} nulls ({cnt/len(df)*100:.1f}%)")
if nulls.sum() == 0:
    print("  Zero null values detected across all columns.")

print("\n--- VALUE RANGES ---")
print(f"Estimated Value (INR): min = Rs. {df['estimated_value_inr'].min():,.0f} | max = Rs. {df['estimated_value_inr'].max():,.0f} | mean = Rs. {df['estimated_value_inr'].mean():,.0f}")
print(f"EMD Amount (INR):      min = Rs. {df['emd_amount_inr'].min():,.0f} | max = Rs. {df['emd_amount_inr'].max():,.0f}")
print(f"Tender Fee (INR):      min = Rs. {df['tender_fee_inr'].min():,.0f} | max = Rs. {df['tender_fee_inr'].max():,.0f}")

print("\n--- LOCATION FIELD ANOMALIES ---")
loc_counts = df['location'].value_counts()
print(loc_counts)

print("\n--- ZERO ESTIMATED VALUE ROWS ---")
zero_val = df[df['estimated_value_inr'] <= 0]
print(f"Count of rows with Estimated Value <= 0: {len(zero_val)}")
for idx, r in zero_val.iterrows():
    print(f"  [{r['tender_id']}] {r['department']} | {r['title'][:45]}... | EMD: Rs. {r['emd_amount_inr']:,.0f}")

print("\n--- CORRIGENDA COUNTS ---")
print(df['corrigendum_count'].value_counts().sort_index())

print("\n--- STATUS BREAKDOWN ---")
print(df['status'].value_counts())

print("\n--- SOURCE BREAKDOWN ---")
print(df['source'].value_counts())

print("\n--- VENUE (MANTRIPUKHRI / IT SEZ) SPOTLIGHT ---")
venue_df = df[df['is_mantripukhri_venue'] == True]
print(f"Count of Mantripukhri Venue Tenders: {len(venue_df)}")
for idx, r in venue_df.iterrows():
    print(f"  * [{r['tender_id']}] Est: Rs. {r['estimated_value_inr']:,.0f} | EMD: Rs. {r['emd_amount_inr']:,.0f} | Corr: {r['corrigendum_count']} | {r['title'][:60]}")
