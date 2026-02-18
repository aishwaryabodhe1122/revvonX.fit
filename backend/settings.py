
import os
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "aishubodhe7007@gmail.com")
ADMIN_PHONE = os.getenv("ADMIN_PHONE", "+918317206235")
ADMIN_NAME = os.getenv("ADMIN_NAME", "Admin")
ADMIN_ALLOWED_SET = {ADMIN_EMAIL.lower(), ADMIN_PHONE}
JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret_change_me")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "43200"))
OTP_EXPIRE_MINUTES = int(os.getenv("OTP_EXPIRE_MINUTES", "10"))
DB_URL = os.getenv("DB_URL", "sqlite:///./db.sqlite")
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", ADMIN_EMAIL)
