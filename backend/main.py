
from fastapi import FastAPI, Body, HTTPException, Header, Depends, Request, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
import jwt
import os
import shutil
from pathlib import Path
from settings import ADMIN_EMAIL, JWT_SECRET
from email_util import send_email
from auth import issue_otp, verify_otp_and_issue_token, is_authorized_identifier, normalize_identifier
from store import contacts_create, contacts_list, contacts_delete, blogs_create, blogs_list, blogs_update, blogs_delete, services_list, services_create, services_update, services_delete, comments_create, comments_list, comments_delete, subscribers_create, subscribers_list, subscribers_delete
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Revon.Fit API", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Create uploads directory
UPLOADS_DIR = Path("uploads")
UPLOADS_DIR.mkdir(exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

def require_bearer(token: Optional[str] = Header(default=None, alias="Authorization")):
    if not token or not token.startswith("Bearer "): raise HTTPException(status_code=401, detail="Missing token")
    token = token.split(" ",1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if payload.get("role")!="admin": raise HTTPException(status_code=403, detail="Forbidden")
        return payload
    except jwt.PyJWTError: raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/api/auth/request-otp")
def auth_request_otp(payload: Dict[str,str] = Body(...), request: Request = None):
    identifier = normalize_identifier(payload.get("identifier",""))
    if not identifier: raise HTTPException(status_code=400, detail="Identifier required")
    if not is_authorized_identifier(identifier):
        ip = request.client.host if request and request.client else "unknown"
        send_email(ADMIN_EMAIL, "Unauthorized Admin Login Attempt", f"Attempted identifier: {identifier}\nIP: {ip}")
        raise HTTPException(status_code=401, detail="Unauthorized Credentials!")
    issue_otp(identifier); return {"status":"otp_sent"}

@app.post("/api/auth/verify-otp")
def auth_verify_otp(payload: Dict[str,str] = Body(...)):
    identifier = normalize_identifier(payload.get("identifier","")); otp = payload.get("otp","")
    token = verify_otp_and_issue_token(identifier, otp)
    if not token: raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"token": token}

@app.post("/api/contact")
def create_contact(payload: Dict[str,Any] = Body(...)):
    if not payload.get("agree"): raise HTTPException(status_code=400, detail="Consent required")
    
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip()
    phone = payload.get("phone", "").strip()
    whatsapp = payload.get("whatsapp", "").strip()
    query = payload.get("query", "").strip()
    
    data = { "name":name, "email":email, "phone":phone, "whatsapp":whatsapp, "query":query }
    _id = contacts_create(data)
    
    # Send confirmation email to user
    if email:
        subject = "We've Received Your Query! 📧"
        body = f"""
Dear {name or 'Friend'},

Thank you for reaching out to RevvonX.Fit! 🎉

We've successfully received your query and our team is excited to help you on your fitness journey.

Your Query Details:
📝 Message: {query}
📞 Phone: {phone or 'Not provided'}
💬 WhatsApp: {whatsapp or 'Not provided'}

What happens next:
✅ Our team will review your query within 24 hours
✅ You'll receive a personalized response via email or phone
✅ We'll provide tailored recommendations based on your goals
✅ If needed, we'll schedule a free consultation call

Ready to transform your fitness journey? Here's what we offer:
• Personal Training (Online & Offline in Pune)
• Customized Workout Plans
• Nutrition Coaching & Diet Plans
• Transformation Programs
• 24/7 Support & Guidance

Connect with us directly:
📧 Email: coach@RevvonX.Fit.co
📞 Phone: +91 88308 89788
📱 WhatsApp: +91 88308 89788
📍 Location: Pune, India | Online Worldwide

Your fitness transformation starts here! We're committed to helping you achieve your health and wellness goals.

Best regards,
Sushil Chaudhari
Founder & Head Coach
RevvonX.Fit

---
P.S. Check out our latest blog posts for free fitness tips and nutrition advice!
"""
        
        try:
            email_sent = send_email(email, subject, body)
            print(f"[DEBUG] Contact confirmation email sent to {email}: {email_sent}")
        except Exception as e:
            print(f"[ERROR] Failed to send contact confirmation email to {email}: {str(e)}")
    
    return {"status":"ok", "id":_id, "message": "Query submitted successfully! We'll contact you soon."}

@app.post("/api/subscribe")
def subscribe_newsletter(payload: Dict[str,str] = Body(...)):
    email = payload.get("email", "").strip()
    if not email: raise HTTPException(status_code=400, detail="Email required")
    
    # Save subscriber to database
    try:
        subscribers_create({"email": email})
    except Exception as e:
        print(f"[ERROR] Failed to save subscriber {email}: {str(e)}")
        # Continue with email sending even if database save fails
    
    # Send subscription confirmation email
    subject = "Welcome to RevvonX.Fit Newsletter! 🎉"
    body = f"""
Dear Subscriber,

Thank you for subscribing to the RevvonX.Fit newsletter! 🎉

You're now part of our fitness community where you'll receive:
- 📝 Latest fitness articles and workout tips
- 🥗 Nutrition advice and healthy recipes  
- 💪 Motivation and success stories
- 🎯 Exclusive fitness challenges and events
- 📅 Updates on new programs and services

What to expect:
• Weekly fitness tips and science-backed insights
• Personal training and nutrition coaching updates
• Special offers for subscribers only
• Early access to new blog posts and programs

Stay connected with us:
📧 Email: coach@RevvonX.Fit.co
📞 Phone: +91 88308 89788
📍 Location: Pune, India | Online Worldwide

Your fitness journey starts here! Let's transform your body and mind together.

Best regards,
Sushil Chaudhari
Founder & Head Coach
RevvonX.Fit

---
If you didn't subscribe to this newsletter, please ignore this email.
To unsubscribe, reply with "UNSUBSCRIBE" in the subject line.
"""
    
    try:
        email_sent = send_email(email, subject, body)
        if email_sent:
            return {"status": "ok", "message": "Subscription successful! Check your email for confirmation."}
        else:
            # Email failed but still record subscription
            return {"status": "ok", "message": "Subscription successful! (Email delivery temporarily unavailable)"}
    except Exception as e:
        print(f"[ERROR] Failed to send subscription email to {email}: {str(e)}")
        return {"status": "ok", "message": "Subscription successful! (Email delivery failed)"}

# Admin subscriber endpoints
@app.get("/api/admin/subscribers")
def admin_subscribers(user=Depends(require_bearer)): 
    return subscribers_list()

@app.delete("/api/admin/subscribers/{id_}")
def admin_subscribers_delete(id_: str, user=Depends(require_bearer)):
    if not subscribers_delete(id_): raise HTTPException(status_code=404, detail="Not found")
    return {"status":"deleted"}

@app.get("/api/blogs")
def public_blogs(): return blogs_list()

@app.get("/api/services")
def public_services(): return services_list()

@app.get("/api/admin/contacts")
def admin_contacts(user=Depends(require_bearer)): return contacts_list()

@app.delete("/api/admin/contacts/{id_}")
def admin_contacts_delete(id_: str, user=Depends(require_bearer)):
    if not contacts_delete(id_): raise HTTPException(status_code=404, detail="Not found")
    return {"status":"deleted"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), user=Depends(require_bearer)):
    try:
        # Validate file type
        allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf"}
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        # Generate unique filename
        import uuid
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOADS_DIR / unique_filename
        
        # Save file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return URL
        return {"url": f"/uploads/{unique_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/blogs")
def admin_blog_create(payload: Dict[str,Any] = Body(...), user=Depends(require_bearer)):
    for k in ["title","excerpt","content"]:
        if not payload.get(k): raise HTTPException(status_code=400, detail="Missing fields")
    _id = blogs_create({"title":payload["title"], "excerpt":payload["excerpt"], "content":payload["content"], "tags": payload.get("tags", []), "media": payload.get("media", [])})
    return {"status":"ok", "id":_id}

@app.put("/api/admin/blogs/{id_}")
def admin_blog_update(id_: str, payload: Dict[str,Any] = Body(...), user=Depends(require_bearer)):
    if not blogs_update(id_, payload): raise HTTPException(status_code=404, detail="Not found")
    return {"status":"updated"}

@app.delete("/api/admin/blogs/{id_}")
def admin_blog_delete(id_: str, user=Depends(require_bearer)):
    if not blogs_delete(id_): raise HTTPException(status_code=404, detail="Not found")
    return {"status":"deleted"}

@app.get("/api/admin/services")
def admin_services(user=Depends(require_bearer)): return services_list()

@app.post("/api/admin/services")
def admin_service_create(payload: Dict[str,Any] = Body(...), user=Depends(require_bearer)):
    for k in ["title","price","summary","details"]:
        if not payload.get(k): raise HTTPException(status_code=400, detail="Missing fields")
    _id = services_create({"title":payload["title"],"price":payload["price"],"summary":payload["summary"],"details":payload["details"],"tags":payload.get("tags",[]),"media":payload.get("media",[])})
    return {"status":"ok","id":_id}

@app.put("/api/admin/services/{id_}")
def admin_service_update(id_: str, payload: Dict[str,Any] = Body(...), user=Depends(require_bearer)):
    if not services_update(id_, payload): raise HTTPException(status_code=404, detail="Not found")
    return {"status":"updated"}

@app.delete("/api/admin/services/{id_}")
def admin_service_delete(id_: str, user=Depends(require_bearer)):
    if not services_delete(id_): raise HTTPException(status_code=404, detail="Not found")
    return {"status":"deleted"}

# COMMENTS
@app.get("/api/blogs/{blog_id}/comments")
def get_blog_comments(blog_id: str):
    return comments_list(blog_id)

@app.post("/api/blogs/{blog_id}/comments")
def create_blog_comment(blog_id: str, payload: Dict[str,Any] = Body(...)):
    for k in ["author_name", "author_email", "comment_text"]:
        if not payload.get(k): raise HTTPException(status_code=400, detail="Missing fields")
    _id = comments_create({"blog_id": blog_id, "author_name": payload["author_name"], "author_email": payload["author_email"], "comment_text": payload["comment_text"], "parent_id": payload.get("parent_id"), "is_admin": payload.get("is_admin", False)})
    return {"status":"ok", "id":_id}

@app.delete("/api/admin/comments/{id_}")
def admin_comment_delete(id_: str, user=Depends(require_bearer)):
    if not comments_delete(id_): raise HTTPException(status_code=404, detail="Not found")
    return {"status":"deleted"}
