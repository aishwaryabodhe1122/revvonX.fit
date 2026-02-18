
import { useState } from 'react'; import Layout from '../components/Layout'; import { API_BASE } from '../components/config';
export default function ContactPage(){
  const [form, setForm] = useState({ name:'', email:'', phone:'', whatsapp:'', query:'', agree:false }); const [sent, setSent] = useState<'idle'|'ok'|'error'>('idle');
  const submit = async (e:React.FormEvent)=>{ e.preventDefault(); setSent('idle'); try{ const r=await fetch(`${API_BASE}/api/contact`,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)}); setSent(r.ok?'ok':'error'); if(r.ok) setForm({ name:'', email:'', phone:'', whatsapp:'', query:'', agree:false }); }catch{ setSent('error'); } };
  return (<Layout title="Contact"><section className="section"><div className="container"><div className="row g-4">
    <div className="col-lg-6"><h1 className="fw-bold mb-2">Get in Touch</h1><p className="text-secondary">Tell me about your goals — strength, fat loss, endurance, or overall wellness. I will respond within 24 hours.</p>
      <div className="card-luxe p-4"><form onSubmit={submit}><div className="row g-3">
        <div className="col-md-6"><label className="form-label">Name</label><input className="form-control" required value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
        <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></div>
        <div className="col-md-6"><label className="form-label">Contact Number</label><input className="form-control" required value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/></div>
        <div className="col-md-6"><label className="form-label">WhatsApp Number</label><input className="form-control" value={form.whatsapp} onChange={e=>setForm({...form, whatsapp:e.target.value})}/></div>
        <div className="col-12"><label className="form-label">Your Query</label><textarea className="form-control" rows={4} required value={form.query} onChange={e=>setForm({...form, query:e.target.value})}></textarea></div>
        <div className="col-12 form-check"><input className="form-check-input" type="checkbox" id="agree" checked={form.agree} onChange={e=>setForm({...form, agree:e.target.checked})} required/><label className="form-check-label" htmlFor="agree">I agree to the Terms & Conditions and consent to being contacted.</label></div>
        <div className="col-12"><button className="btn btn-gold btn-lg w-100">Submit</button></div>
      </div></form>{sent==='ok'&&<div className="alert alert-success mt-3">Thanks! Your message has been sent.</div>}{sent==='error'&&<div className="alert alert-danger mt-3">Something went wrong. Please try again.</div>}</div></div>
    <div className="col-lg-6"><h2 className="fw-bold mb-3">Contact Information</h2><div className="card-luxe p-4"><ul className="list-unstyled mb-0">
      <li className="mb-2"><strong>Name:</strong> Mr. Sushil Chaudhari (Trainer & Nutritionist)</li>
      <li className="mb-2"><strong>Email:</strong> coach@Revon.Fit.co</li>
      <li className="mb-2"><strong>Phone:</strong> +91 88308 89788</li>
      <li className="mb-2"><strong>WhatsApp:</strong> +91 88308 89788</li>
      <li className="mb-2"><strong>Location:</strong> Pune • Online worldwide</li>
    </ul></div></div>
  </div></div></section></Layout>);
}
