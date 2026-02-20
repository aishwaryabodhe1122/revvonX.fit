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

    def blogs_update(id_: str, data: Dict[str, Any]) -> bool:
        return _coll("blogs").update_one({"_id": ObjectId(id_)}, {"$set": data}).modified_count > 0

    def blogs_delete(id_: str) -> bool:
        return _coll("blogs").delete_one({"_id": ObjectId(id_)}).deleted_count > 0

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

    # COMMENTS
    def comments_create(data: Dict[str, Any]) -> str:
        res = _coll("comments").insert_one({**data, "created_at": datetime.utcnow()})
        return str(res.inserted_id)

    def comments_list(blog_id: str) -> List[Dict[str, Any]]:
        items = list(_coll("comments").find({"blog_id": blog_id}).sort("created_at", 1))
        for x in items:
            x["id"] = str(x.pop("_id"))
            x["created_at"] = x["created_at"].isoformat()
        return items

    def comments_delete(id_: str) -> bool:
        return _coll("comments").delete_one({"_id": ObjectId(id_)}).deleted_count > 0

    # SUBSCRIBERS
    def subscribers_create(data: Dict[str, Any]) -> str:
        res = _coll("subscribers").insert_one({**data, "created_at": datetime.utcnow()})
        return str(res.inserted_id)

    def subscribers_list() -> List[Dict[str, Any]]:
        items = list(_coll("subscribers").find().sort("created_at", -1))
        for x in items:
            x["id"] = str(x.pop("_id"))
            x["created_at"] = x["created_at"].isoformat()
        return items

    def subscribers_delete(id_: str) -> bool:
        return _coll("subscribers").delete_one({"_id": ObjectId(id_)}).deleted_count > 0

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
        media_csv: str = ""  # comma-separated media URLs
        published_date: datetime = Field(default_factory=datetime.utcnow)

    class Service(SQLModel, table=True):
        id: Optional[int] = Field(default=None, primary_key=True)
        title: str
        price: str
        tags_csv: str = ""
        media_csv: str = ""  # comma-separated media URLs
        summary: str
        details: str

    class Comment(SQLModel, table=True):
        id: Optional[int] = Field(default=None, primary_key=True)
        blog_id: str
        author_name: str
        author_email: str
        comment_text: str
        parent_id: Optional[str] = None  # for replies
        is_admin: bool = False
        created_at: datetime = Field(default_factory=datetime.utcnow)

    class Subscriber(SQLModel, table=True):
        id: Optional[int] = Field(default=None, primary_key=True)
        email: str
        created_at: datetime = Field(default_factory=datetime.utcnow)

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
            b = Blog(
                title=data["title"],
                excerpt=data["excerpt"],
                content=data["content"],
                tags_csv=",".join(data.get("tags", [])),
                media_csv=",".join(data.get("media", []))
            )
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
                "media": [m for m in b.media_csv.split(",") if m],
                "published_date": b.published_date.isoformat()
            } for b in items]

    def blogs_update(id_: str, data: Dict[str, Any]) -> bool:
        with Session(engine) as s:
            obj = s.get(Blog, int(id_))
            if not obj:
                return False
            obj.title = data.get("title", obj.title)
            obj.excerpt = data.get("excerpt", obj.excerpt)
            obj.content = data.get("content", obj.content)
            if "tags" in data:
                obj.tags_csv = ",".join(data["tags"]) if isinstance(data["tags"], list) else str(data["tags"])
            if "media" in data:
                obj.media_csv = ",".join(data["media"]) if isinstance(data["media"], list) else str(data["media"])
            s.add(obj)
            s.commit()
            return True

    def blogs_delete(id_: str) -> bool:
        with Session(engine) as s:
            obj = s.get(Blog, int(id_))
            if not obj:
                return False
            s.delete(obj)
            s.commit()
            return True

    # SERVICES
    def services_list() -> List[Dict[str, Any]]:
        with Session(engine) as s:
            items = s.exec(select(Service).order_by(Service.title.asc())).all()
            return [{
                "id": str(x.id),
                "title": x.title,
                "price": x.price,
                "tags": [t for t in x.tags_csv.split(",") if t],
                "media": [m for m in x.media_csv.split(",") if m],
                "summary": x.summary,
                "details": x.details
            } for x in items]

    def services_create(data: Dict[str, Any]) -> str:
        with Session(engine) as s:
            sv = Service(
                title=data["title"],
                price=data["price"],
                tags_csv=",".join(data.get("tags", [])),
                media_csv=",".join(data.get("media", [])),
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
            if "media" in data:
                obj.media_csv = ",".join(data["media"]) if isinstance(data["media"], list) else str(data["media"])
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

    # COMMENTS
    def comments_create(data: Dict[str, Any]) -> str:
        with Session(engine) as s:
            c = Comment(
                blog_id=data["blog_id"],
                author_name=data["author_name"],
                author_email=data["author_email"],
                comment_text=data["comment_text"],
                parent_id=data.get("parent_id"),
                is_admin=data.get("is_admin", False)
            )
            s.add(c)
            s.commit()
            s.refresh(c)
            return str(c.id)

    def comments_list(blog_id: str) -> List[Dict[str, Any]]:
        with Session(engine) as s:
            items = s.exec(select(Comment).where(Comment.blog_id == blog_id).order_by(Comment.created_at.asc())).all()
            return [{
                "id": str(c.id),
                "blog_id": c.blog_id,
                "author_name": c.author_name,
                "author_email": c.author_email,
                "comment_text": c.comment_text,
                "parent_id": c.parent_id,
                "is_admin": c.is_admin,
                "created_at": c.created_at.isoformat()
            } for c in items]

    def comments_delete(id_: str) -> bool:
        with Session(engine) as s:
            obj = s.get(Comment, int(id_))
            if not obj:
                return False
            s.delete(obj)
            s.commit()
            return True

    # SUBSCRIBERS
    def subscribers_create(data: Dict[str, Any]) -> str:
        with Session(engine) as s:
            sub = Subscriber(email=data["email"])
            s.add(sub)
            s.commit()
            s.refresh(sub)
            return str(sub.id)

    def subscribers_list() -> List[Dict[str, Any]]:
        with Session(engine) as s:
            items = s.exec(select(Subscriber).order_by(Subscriber.created_at.desc())).all()
            return [{
                "id": str(s.id),
                "email": s.email,
                "created_at": s.created_at.isoformat()
            } for s in items]

    def subscribers_delete(id_: str) -> bool:
        with Session(engine) as s:
            obj = s.get(Subscriber, int(id_))
            if not obj:
                return False
            s.delete(obj)
            s.commit()
            return True
