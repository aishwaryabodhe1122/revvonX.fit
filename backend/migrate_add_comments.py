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
    # Create comment table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blog_id TEXT NOT NULL,
            author_name TEXT NOT NULL,
            author_email TEXT NOT NULL,
            comment_text TEXT NOT NULL,
            parent_id TEXT,
            is_admin INTEGER DEFAULT 0,
            created_at TIMESTAMP NOT NULL
        )
    """)
    print("✓ Created comment table")
except sqlite3.Error as e:
    print(f"✗ Error creating comment table: {e}")

conn.commit()
conn.close()

print("\n✅ Migration completed successfully!")
