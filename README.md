
# Revon.Fit — Premium Fitness & Nutrition (Full-Stack)

Dark, luxurious Next.js frontend + FastAPI backend with OTP-protected Admin dashboard.

## Run

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env (ADMIN_EMAIL/PHONE, JWT_SECRET, DB_URL, SMTP_*)
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
echo "NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000" > .env.local
npm install
npm run dev
```

## Admin Dashboard
- Navbar **Admin** button → `/admin/login`
- Enter allowed **email or phone** → **OTP** sent via email (configure SMTP) → Login
- Unauthorized identifiers show **"Unauthorized Credentials!"** (red) and trigger an alert email to admin.

## Database Options
- **SQLite/Postgres** via SQLModel (`DB_URL=sqlite:///./db.sqlite` or a Postgres URL)
- **MongoDB** via PyMongo (set `DB_URL` to your Mongo URL)

## Features
- Public pages: Home, Services (expandable), Blogs (with subscribe stub), Contact form
- Admin pages: Contacts (list/delete), Blogs (create/publish), Packages (CRUD)
- JWT stored in localStorage; admin APIs require `Authorization: Bearer <token>`
