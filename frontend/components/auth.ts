
export function getToken(){ 
  if(typeof window==='undefined') return null; 
  const token = localStorage.getItem('Revon.Fit_token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    if (Date.now() >= exp) {
      localStorage.removeItem('Revon.Fit_token');
      return null;
    }
    return token;
  } catch {
    return token;
  }
}

export function setToken(t:string){ 
  if(typeof window==='undefined') return; 
  localStorage.setItem('Revon.Fit_token', t);
  localStorage.setItem('Revon.Fit_loginTime', Date.now().toString());
}

export function logout(){ 
  if(typeof window==='undefined') return; 
  localStorage.removeItem('Revon.Fit_token');
  localStorage.removeItem('Revon.Fit_loginTime');
  window.location.href='/admin/login'; 
}

export function authHeaders(){ 
  const t=getToken(); 
  return t? { Authorization: `Bearer ${t}` } : {}; 
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
