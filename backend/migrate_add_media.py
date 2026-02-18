import sqlite3
from pathlib import Path

# Connect to the database
db_path = Path("db.sqlite")
if not db_path.exists():
    print("Database file not found!")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Add media_csv column to blog table
    cursor.execute("ALTER TABLE blog ADD COLUMN media_csv TEXT DEFAULT ''")
    print("✓ Added media_csv column to blog table")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("✓ media_csv column already exists in blog table")
    else:
        print(f"✗ Error adding column to blog table: {e}")

try:
    # Add media_csv column to service table
    cursor.execute("ALTER TABLE service ADD COLUMN media_csv TEXT DEFAULT ''")
    print("✓ Added media_csv column to service table")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("✓ media_csv column already exists in service table")
    else:
        print(f"✗ Error adding column to service table: {e}")

conn.commit()
conn.close()

print("\n✅ Migration completed successfully!")
