import sys
import pandas as pd

sys.stdout.reconfigure(encoding='utf-8')
df = pd.read_csv('data/raw/tenders_manipur.csv')
print('=== CHEIRAP AI DATASET VERIFICATION ===')
print(f'Total Rows: {len(df)}')
total_val_cr = df['estimated_value_inr'].sum() / 1e7
print(f'Total Procurement Value: Rs. {total_val_cr:,.2f} Crores')
print('\nDepartment Distribution:')
for dept, count in df['department'].value_counts().items():
    print(f'  - {dept}: {count}')

print(f'\nHackathon Venue Spotlight (Mantripukhri / IT SEZ): {len(df[df["is_mantripukhri_venue"] == True])} Tenders')
for idx, r in df[df['is_mantripukhri_venue'] == True].iterrows():
    print(f'  * [{r["tender_id"]}] {r["title"][:75]}... (EMD: Rs. {r["emd_amount_inr"]:,.0f})')
