
export function getToken(){ if(typeof window==='undefined') return null; return localStorage.getItem('Revon.Fit_token'); }
export function setToken(t:string){ if(typeof window==='undefined') return; localStorage.setItem('Revon.Fit_token', t); }
export function authHeaders(){ const t=getToken(); return t? { Authorization: `Bearer ${t}` } : {}; }
