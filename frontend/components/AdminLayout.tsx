
import Link from 'next/link';
export default function AdminLayout({ children, title }: { children: React.ReactNode, title?: string }) {
  return (<div>
    <nav className="navbar navbar-expand-lg sticky-top"><div className="container">
      <Link className="navbar-brand" href="/admin">Admin • Revon.Fit</Link>
      <div className="collapse navbar-collapse show">
        <ul className="navbar-nav ms-auto gap-3">
          <li className="nav-item"><Link className="nav-link" href="/admin/contacts">Contacts</Link></li>
          <li className="nav-item"><Link className="nav-link" href="/admin/blogs">Blogs</Link></li>
          <li className="nav-item"><Link className="nav-link" href="/admin/packages">Packages</Link></li>
          <li className="nav-item"><Link className="nav-link" href="/">Back to Site</Link></li>
        </ul>
      </div>
    </div></nav>
    <main className="container section"><h1 className="fw-bold mb-4">{title || 'Admin'}</h1>{children}</main>
  </div>);
}
