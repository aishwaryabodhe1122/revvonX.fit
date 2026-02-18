
import { useState } from 'react'; import Link from 'next/link'; import { API_BASE } from '../../components/config'; import { setToken } from '../../components/auth';
export default function AdminLogin(){
  const [identifier, setIdentifier] = useState(''); const [otpSent, setOtpSent] = useState(false); const [otp, setOtp] = useState(''); const [msg, setMsg] = useState<{type:'info'|'danger'|'success', text:string} | null>(null); const [loading, setLoading] = useState(false);
  const requestOtp = async (e:React.FormEvent)=>{ e.preventDefault(); setLoading(true); setMsg(null); try{ const r=await fetch(`${API_BASE}/api/auth/request-otp`,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({identifier})}); if(r.ok){ setOtpSent(true); setMsg({type:'info', text:'OTP sent. Please check your email.'}); } else { const t=await r.json().catch(()=>({detail:'Unauthorized Credentials!'})); setMsg({type:'danger', text: t.detail || 'Unauthorized Credentials!'}); } } finally { setLoading(false); } };
  const verifyOtp = async (e:React.FormEvent)=>{ e.preventDefault(); setLoading(true); setMsg(null); try{ const r=await fetch(`${API_BASE}/api/auth/verify-otp`,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({identifier, otp})}); if(r.ok){ const data=await r.json(); setToken(data.token); setMsg({type:'success', text:'Login successful. Redirecting...'}); setTimeout(()=>{ window.location.href='/admin/contacts'; }, 500); } else { const t=await r.json().catch(()=>({detail:'Invalid or expired OTP'})); setMsg({type:'danger', text: t.detail || 'Invalid or expired OTP'}); } } finally { setLoading(false); } };
  return (<div className="container section" style={{maxWidth:560}}><div className="card-luxe p-4"><h1 className="fw-bold mb-3">Admin Login</h1>
    {!otpSent ? (<form onSubmit={requestOtp} className="d-grid gap-3">
      <div><label className="form-label">Email or Phone</label><input className="form-control" placeholder="Enter admin email or phone" value={identifier} onChange={e=>setIdentifier(e.target.value)} required/></div>
      <button className="btn btn-gold" disabled={loading}>{loading?'Please wait...':'Send OTP'}</button>
      {msg && <div className={`alert alert-${msg.type} ${msg.type==='danger' ? 'text-danger':''}`}>{msg.text}</div>}
    </form>) : (<form onSubmit={verifyOtp} className="d-grid gap-3">
      <div><label className="form-label">Enter OTP</label><input className="form-control" value={otp} onChange={e=>setOtp(e.target.value)} required maxLength={6}/></div>
      <button className="btn btn-gold" disabled={loading}>{loading?'Verifying...':'Verify OTP & Login'}</button>
      <button type="button" className="btn btn-outline-light" onClick={()=>setOtpSent(false)}>Change email/phone</button>
      {msg && <div className={`alert alert-${msg.type} ${msg.type==='danger' ? 'text-danger':''}`}>{msg.text}</div>}
    </form>)}
    <div className="mt-3"><Link className="text-secondary" href="/">← Back to site</Link></div>
  </div></div>);
}
