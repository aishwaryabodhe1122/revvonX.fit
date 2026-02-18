import time, random, jwt
from typing import Dict
from datetime import datetime, timedelta
from settings import ADMIN_ALLOWED_SET, ADMIN_EMAIL, JWT_SECRET, JWT_EXPIRE_MINUTES, OTP_EXPIRE_MINUTES
from email_util import send_email

OTP_STORE: Dict[str, Dict[str, str | float]] = {}

def normalize_identifier(identifier: str) -> str:
    return identifier.strip().lower()

def is_authorized_identifier(identifier: str) -> bool:
    normalized = normalize_identifier(identifier)
    is_allowed = normalized in {x.lower() for x in ADMIN_ALLOWED_SET}
    print(f"[DEBUG] Checking if {identifier} is authorized: {is_allowed}")
    return is_allowed

def issue_otp(identifier: str) -> None:
    try:
        normalized = normalize_identifier(identifier)
        otp = f"{random.randint(0, 999999):06d}"
        exp = time.time() + OTP_EXPIRE_MINUTES * 60
        
        print(f"[DEBUG] Generated OTP for {identifier} (normalized: {normalized}): {otp}")
        print(f"[DEBUG] OTP will expire at: {datetime.fromtimestamp(exp).strftime('%Y-%m-%d %H:%M:%S')}")
        
        OTP_STORE[normalized] = {"otp": otp, "exp": exp}
        print(f"[DEBUG] OTP stored in memory. Current OTP store: {list(OTP_STORE.keys())}")
        
        email_subject = f"Your Revon.Fit Admin OTP"
        email_body = f"OTP for {identifier}: {otp}\nThis code expires in {OTP_EXPIRE_MINUTES} minutes."
        
        print(f"[DEBUG] Sending email to {ADMIN_EMAIL}...")
        send_email(ADMIN_EMAIL, email_subject, email_body)
        print("[DEBUG] Email sent successfully!")
        
    except Exception as e:
        print(f"[ERROR] Error in issue_otp: {str(e)}")
        raise

def verify_otp_and_issue_token(identifier: str, otp: str) -> str | None:
    try:
        normalized = normalize_identifier(identifier)
        print(f"[DEBUG] Verifying OTP for {identifier} (normalized: {normalized})")
        
        rec = OTP_STORE.get(normalized)
        if not rec:
            print("[DEBUG] No OTP found for this identifier")
            return None
            
        current_time = time.time()
        if current_time > float(rec["exp"]):
            print(f"[DEBUG] OTP expired. Current time: {current_time}, Expiry: {rec['exp']}")
            del OTP_STORE[normalized]
            return None
            
        if str(rec["otp"]) != str(otp).strip():
            print(f"[DEBUG] Invalid OTP. Expected: {rec['otp']}, Got: {otp}")
            return None
            
        print("[DEBUG] OTP verified successfully")
        del OTP_STORE[normalized]
        
        payload = {
            "sub": normalized,
            "role": "admin",
            "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        print("[DEBUG] JWT token generated successfully")
        return token
        
    except Exception as e:
        print(f"[ERROR] Error in verify_otp_and_issue_token: {str(e)}")
        return None
