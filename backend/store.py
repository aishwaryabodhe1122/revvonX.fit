from datetime import datetime
from typing import List, Dict, Any, Optional
from settings import DB_URL

USE_MONGO = DB_URL.startswith("mongodb://") or DB_URL.startswith("mongodb+srv://")

if USE_MONGO:
    from pymongo import MongoClient
    from bson import ObjectId
    client = MongoClient(DB_URL)
    db = client.get_default_database()

    def _coll(name: str):
        return db[name]

    # CONTACTS
    def contacts_create(data: Dict[str, Any]) -> str:
        res = _coll("contacts").insert_one({**data, "created_at": datetime.utcnow()})
        return str(res.inserted_id)

    def contacts_list() -> List[Dict[str, Any]]:
        items = list(_coll("contacts").find().sort("created_at", -1))
        for x in items:
            x["id"] = str(x.pop("_id"))
            x["created_at"] = x["created_at"].isoformat()
        return items

    def contacts_delete(id_: str) -> bool:
        return _coll("contacts").delete_one({"_id": ObjectId(id_)}).deleted_count > 0

    # BLOGS
    def blogs_create(data: Dict[str, Any]) -> str:
        res = _coll("blogs").insert_one({**data, "published_date": datetime.utcnow()})
        return str(res.inserted_id)

    def blogs_list() -> List[Dict[str, Any]]:
        items = list(_coll("blogs").find().sort("published_date", -1))
        for x in items:
            x["id"] = str(x.pop("_id"))
            x["published_date"] = x["published_date"].isoformat()
        return items

    # SERVICES
    def services_list() -> List[Dict[str, Any]]:
        items = list(_coll("services").find().sort("title", 1))
        for x in items:
            x["id"] = str(x.pop("_id"))
        return items

    def services_create(data: Dict[str, Any]) -> str:
        return str(_coll("services").insert_one(data).inserted_id)

    def services_update(id_: str, data: Dict[str, Any]) -> bool:
        return _coll("services").update_one({"_id": ObjectId(id_)}, {"$set": data}).modified_count > 0

    def services_delete(id_: str) -> bool:
        return _coll("services").delete_one({"_id": ObjectId(id_)}).deleted_count > 0

else:
    # SQLModel (SQLite/Postgres)
    from sqlmodel import SQLModel, Field, create_engine, Session, select
    from typing import Optional

    engine = create_engine(DB_URL, connect_args={"check_same_thread": False} if DB_URL.startswith("sqlite") else {})

    class Contact(SQLModel, table=True):
        id: Optional[int] = Field(default=None, primary_key=True)
        name: str
        email: str
        phone: str
        whatsapp: Optional[str] = None
        query: str
        created_at: datetime = Field(default_factory=datetime.utcnow)

    class Blog(SQLModel, table=True):
        id: Optional[int] = Field(default=None, primary_key=True)
        title: str
        excerpt: str
        content: str
        tags_csv: str = ""
        published_date: datetime = Field(default_factory=datetime.utcnow)

    class Service(SQLModel, table=True):
        id: Optional[int] = Field(default=None, primary_key=True)
        title: str
        price: str
        tags_csv: str = ""
        summary: str
        details: str

    def init_sql():
        SQLModel.metadata.create_all(engine)

    init_sql()

    # CONTACTS
    def contacts_create(data: Dict[str, Any]) -> str:
        with Session(engine) as s:
            c = Contact(**data)
            s.add(c)
            s.commit()
            s.refresh(c)
            return str(c.id)

    def contacts_list() -> List[Dict[str, Any]]:
        with Session(engine) as s:
            items = s.exec(select(Contact).order_by(Contact.created_at.desc())).all()
            return [{
                "id": str(i.id),
                "name": i.name,
                "email": i.email,
                "phone": i.phone,
                "whatsapp": i.whatsapp,
                "query": i.query,
                "created_at": i.created_at.isoformat()
            } for i in items]

    def contacts_delete(id_: str) -> bool:
        with Session(engine) as s:
            obj = s.get(Contact, int(id_))
            if not obj:
                return False
            s.delete(obj)
            s.commit()
            return True

    # BLOGS
    def blogs_create(data: Dict[str, Any]) -> str:
        with Session(engine) as s:
            b = Blog(**data, tags_csv=",".join(data.get("tags", [])))
            s.add(b)
            s.commit()
            s.refresh(b)
            return str(b.id)

    def blogs_list() -> List[Dict[str, Any]]:
        with Session(engine) as s:
            items = s.exec(select(Blog).order_by(Blog.published_date.desc())).all()
            return [{
                "id": str(b.id),
                "title": b.title,
                "excerpt": b.excerpt,
                "content": b.content,
                "tags": [t for t in b.tags_csv.split(",") if t],
                "published_date": b.published_date.isoformat()
            } for b in items]

    # SERVICES
    def services_list() -> List[Dict[str, Any]]:
        with Session(engine) as s:
            items = s.exec(select(Service).order_by(Service.title.asc())).all()
            return [{
                "id": str(x.id),
                "title": x.title,
                "price": x.price,
                "tags": [t for t in x.tags_csv.split(",") if t],
                "summary": x.summary,
                "details": x.details
            } for x in items]

    def services_create(data: Dict[str, Any]) -> str:
        with Session(engine) as s:
            sv = Service(
                title=data["title"],
                price=data["price"],
                tags_csv=",".join(data.get("tags", [])),
                summary=data["summary"],
                details=data["details"]
            )
            s.add(sv)
            s.commit()
            s.refresh(sv)
            return str(sv.id)

    def services_update(id_: str, data: Dict[str, Any]) -> bool:
        with Session(engine) as s:
            obj = s.get(Service, int(id_))
            if not obj:
                return False
            obj.title = data.get("title", obj.title)
            obj.price = data.get("price", obj.price)
            if "tags" in data:
                obj.tags_csv = ",".join(data["tags"]) if isinstance(data["tags"], list) else str(data["tags"])
            obj.summary = data.get("summary", obj.summary)
            obj.details = data.get("details", obj.details)
            s.add(obj)
            s.commit()
            return True

    def services_delete(id_: str) -> bool:
        with Session(engine) as s:
            obj = s.get(Service, int(id_))
            if not obj:
                return False
            s.delete(obj)
            s.commit()
            return True
