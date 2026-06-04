import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { login, register, shortenUrl, getUserUrls, getUrlStats, deleteUrl } from './services/api';

const G = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:#080810;color:#e8e8f0;font-family:'DM Sans',sans-serif;overflow-x:hidden;cursor:none;}

.cursor{position:fixed;pointer-events:none;z-index:9999;mix-blend-mode:difference;}
.cursor-dot{width:8px;height:8px;background:#fff;border-radius:50%;transform:translate(-50%,-50%);}
.cursor-ring{width:36px;height:36px;border:1px solid rgba(255,255,255,0.5);border-radius:50%;transform:translate(-50%,-50%);transition:width 0.2s,height 0.2s,border-color 0.2s;}
.cursor-ring.hovered{width:56px;height:56px;border-color:#fff;}

::-webkit-scrollbar{width:2px;}
::-webkit-scrollbar-thumb{background:#2a2a4a;}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes slideRight{from{width:0;}to{width:100%;}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
@keyframes marquee{from{transform:translateX(0);}to{transform:translateX(-50%);}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(120,80,255,0.3);}50%{box-shadow:0 0 40px rgba(120,80,255,0.6);}}

.fu{animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;}
.fi{animation:fadeIn 0.4s ease both;}

input,button,textarea{font-family:'DM Sans',sans-serif;}
a{text-decoration:none;color:inherit;}

.noise{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");}

.grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:60px 60px;}

.tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9090b0;border:1px solid #2a2a4a;padding:5px 12px;border-radius:100px;}
.dot{width:6px;height:6px;border-radius:50%;background:#22d98a;animation:pulse 2s infinite;}

.btn-primary{display:inline-flex;align-items:center;gap:8px;background:#7850ff;color:#fff;border:none;padding:14px 28px;border-radius:100px;font-size:14px;font-weight:500;cursor:pointer;letter-spacing:0.02em;transition:all 0.2s;position:relative;overflow:hidden;}
.btn-primary::before{content:'';position:absolute;inset:0;background:rgba(255,255,255,0.1);opacity:0;transition:opacity 0.2s;}
.btn-primary:hover::before{opacity:1;}
.btn-primary:hover{transform:translateY(-1px);}
.btn-ghost{display:inline-flex;align-items:center;gap:8px;background:transparent;color:#9090b0;border:1px solid #2a2a4a;padding:10px 20px;border-radius:100px;font-size:13px;cursor:pointer;transition:all 0.2s;letter-spacing:0.02em;}
.btn-ghost:hover{border-color:#5050a0;color:#e8e8f0;}

.input-field{width:100%;background:rgba(255,255,255,0.04);border:1px solid #2a2a4a;border-radius:12px;padding:14px 18px;color:#e8e8f0;font-size:15px;outline:none;transition:border-color 0.2s;}
.input-field:focus{border-color:#7850ff;}
.input-field::placeholder{color:#4a4a6a;}

.card-glass{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:20px;backdrop-filter:blur(12px);}

.link-row{padding:18px 24px;border-bottom:1px solid #15152a;display:flex;align-items:center;gap:14px;transition:background 0.15s;cursor:default;}
.link-row:hover{background:rgba(120,80,255,0.05);}
.link-row:last-child{border-bottom:none;}

.stat-num{font-family:'Bebas Neue',sans-serif;letter-spacing:0.02em;line-height:1;}

.progress-bar{height:3px;background:#1a1a2e;border-radius:2px;overflow:hidden;}
.progress-fill{height:100%;background:linear-gradient(90deg,#7850ff,#aa80ff);border-radius:2px;transition:width 0.6s cubic-bezier(0.16,1,0.3,1);}

.marquee-track{display:flex;gap:40px;animation:marquee 18s linear infinite;width:max-content;}
.marquee-item{font-size:13px;color:#3a3a5a;white-space:nowrap;display:flex;align-items:center;gap:8px;}

.tab-bar{display:flex;gap:0;border-bottom:1px solid #15152a;margin-bottom:24px;}
.tab{padding:12px 20px;font-size:14px;color:#5a5a7a;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s;letter-spacing:0.02em;}
.tab.active{color:#e8e8f0;border-bottom-color:#7850ff;}

.copy-toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(100px);background:#7850ff;color:#fff;padding:12px 24px;border-radius:100px;font-size:13px;transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);z-index:1000;pointer-events:none;}
.copy-toast.show{transform:translateX(-50%) translateY(0);}

.empty-state{padding:60px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;}

@media(max-width:640px){
  .hide-sm{display:none!important;}
  .stat-grid{grid-template-columns:1fr 1fr!important;}
}
`;

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if(dot.current) { dot.current.style.left=e.clientX+'px'; dot.current.style.top=e.clientY+'px'; }
      if(ring.current) { ring.current.style.left=e.clientX+'px'; ring.current.style.top=e.clientY+'px'; }
    };
    const over = (e) => { if(e.target.closest('button,a,input,.link-row,.tab')) ring.current?.classList.add('hovered'); };
    const out = () => ring.current?.classList.remove('hovered');
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); document.removeEventListener('mouseout', out); };
  }, []);
  return (
    <div className="cursor">
      <div ref={dot} className="cursor-dot" style={{position:'fixed'}} />
      <div ref={ring} className="cursor-ring" style={{position:'fixed'}} />
    </div>
  );
}

function Spinner() {
  return <span style={{width:16,height:16,border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',animation:'spin 0.7s linear infinite'}} />;
}

function Toast({ msg }) {
  return <div className={`copy-toast${msg?' show':''}`}>{msg}</div>;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({name:'',email:'',password:''});
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setErr('');
    try {
      const r = isLogin ? await login(form) : await register(form);
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('userName', r.data.name);
      onLogin();
    } catch(e) { setErr(e.response?.data?.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh',background:'#080810',display:'flex',alignItems:'center',justifyContent:'center',padding:20,position:'relative'}}>
      <style>{G}</style>
      <div className="noise" />
      <div className="grid-bg" />
      <Cursor />

      <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(120,80,255,0.12) 0%,transparent 70%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none'}} />

      <div className="fu" style={{width:'100%',maxWidth:420,position:'relative',zIndex:10}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{fontFamily:'Bebas Neue',fontSize:52,letterSpacing:'0.08em',lineHeight:1,marginBottom:8}}>SHORTLINK</div>
          <div className="tag" style={{margin:'0 auto'}}><span className="dot"/>Fast · Smart · Reliable</div>
        </div>

        <div className="card-glass" style={{padding:36}}>
          <div style={{display:'flex',background:'rgba(255,255,255,0.04)',borderRadius:100,padding:4,marginBottom:28,gap:4}}>
            {['Login','Register'].map((t,i) => (
              <button key={t} onClick={()=>setIsLogin(i===0)} style={{flex:1,padding:'10px',border:'none',borderRadius:100,cursor:'pointer',fontSize:13,fontWeight:500,transition:'all 0.25s',fontFamily:'DM Sans',letterSpacing:'0.03em',background:isLogin===(i===0)?'rgba(255,255,255,0.1)':'transparent',color:isLogin===(i===0)?'#e8e8f0':'#5a5a7a'}}>{t}</button>
            ))}
          </div>

          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12}}>
            {!isLogin && <input className="input-field" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />}
            <input className="input-field" placeholder="Email address" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
            <input className="input-field" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
            {err && <p style={{color:'#ff6080',fontSize:13,background:'rgba(255,96,128,0.08)',padding:'10px 14px',borderRadius:10}}>{err}</p>}
            <button className="btn-primary" type="submit" disabled={loading} style={{justifyContent:'center',marginTop:4,borderRadius:12,padding:'15px'}}>
              {loading ? <><Spinner/> Please wait</> : isLogin ? 'Sign in →' : 'Create account →'}
            </button>
          </form>

          <p style={{color:'#3a3a5a',fontSize:12,textAlign:'center',marginTop:20,fontFamily:'JetBrains Mono'}}>demo: ananya@test.com / test123</p>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [urls, setUrls] = useState([]);
  const [form, setForm] = useState({originalUrl:'',customAlias:'',expiryDays:''});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('links');
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const userName = localStorage.getItem('userName') || 'User';

  const load = async () => { try { const r=await getUserUrls(); setUrls(r.data); } catch(e){} };
  useEffect(()=>{ load(); },[]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''),2500); };

  const copy = (text) => { navigator.clipboard.writeText(text); showToast('Copied to clipboard'); };

  const handleShorten = async (e) => {
    e.preventDefault(); setCreating(true); setErr('');
    try {
      await shortenUrl({originalUrl:form.originalUrl, customAlias:form.customAlias||null, expiryDays:form.expiryDays?parseInt(form.expiryDays):null});
      setForm({originalUrl:'',customAlias:'',expiryDays:''}); setShowCreate(false); load();
      showToast('Link created successfully');
    } catch(e) { setErr(e.response?.data?.message || e.response?.data?.originalUrl || 'Failed'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (code) => {
    if(!window.confirm('Delete this link?')) return;
    try { await deleteUrl(code); load(); showToast('Link deleted'); } catch(e){}
  };

  const handleStats = async (code) => {
    try { const r=await getUrlStats(code); setStats(r.data); setTab('stats'); } catch(e){}
  };

  const active = urls.filter(u=>!u.expiresAt||new Date(u.expiresAt)>new Date()).length;

  return (
    <div style={{minHeight:'100vh',background:'#080810',position:'relative'}}>
      <style>{G}</style>
      <div className="noise" />
      <div className="grid-bg" />
      <Cursor />
      <Toast msg={toast} />

      {/* Glow orb */}
      <div style={{position:'fixed',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(120,80,255,0.08) 0%,transparent 70%)',top:'-100px',right:'-100px',pointerEvents:'none',zIndex:0}} />

      {/* Nav */}
      <nav style={{position:'sticky',top:0,zIndex:100,borderBottom:'1px solid #12122a',backdropFilter:'blur(20px)',background:'rgba(8,8,16,0.85)',padding:'0 40px',height:68,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontFamily:'Bebas Neue',fontSize:28,letterSpacing:'0.08em'}}>SHORTLINK</div>
        <div style={{display:'flex',alignItems:'center',gap:20}}>
          <div className="tag"><span className="dot"/>{active} active</div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#7850ff,#ff50a0)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:500,fontSize:13}}>{userName[0]?.toUpperCase()}</div>
            <span style={{fontSize:14,color:'#9090b0'}}>{userName}</span>
          </div>
          <button className="btn-ghost" onClick={onLogout} style={{padding:'8px 16px',fontSize:12}}>Sign out</button>
        </div>
      </nav>

      {/* Marquee */}
      <div style={{overflow:'hidden',borderBottom:'1px solid #12122a',padding:'10px 0',background:'rgba(255,255,255,0.01)'}}>
        <div className="marquee-track">
          {[...Array(8)].map((_,i)=>(
            <span key={i} className="marquee-item">
              <span style={{width:4,height:4,borderRadius:'50%',background:'#7850ff',display:'inline-block'}}/>
              Fast URL Shortening &nbsp;·&nbsp; Custom Aliases &nbsp;·&nbsp; Click Analytics &nbsp;·&nbsp; Link Expiry &nbsp;·&nbsp; Redis Caching &nbsp;·&nbsp; JWT Auth
            </span>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1000,margin:'0 auto',padding:'48px 24px',position:'relative',zIndex:10}}>

        {/* Hero row */}
        <div className="fu" style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:48,flexWrap:'wrap',gap:20}}>
          <div>
            <p style={{fontSize:13,color:'#5a5a7a',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:12}}>Dashboard</p>
            <h1 style={{fontFamily:'Bebas Neue',fontSize:64,letterSpacing:'0.04em',lineHeight:0.9}}>
              <span style={{color:'#e8e8f0'}}>YOUR</span><br/>
              <span style={{color:'#7850ff'}}>LINKS</span>
            </h1>
          </div>
          <button className="btn-primary" onClick={()=>setShowCreate(!showCreate)} style={{gap:10,padding:'14px 28px'}}>
            <span style={{fontSize:20,lineHeight:1}}>{showCreate?'×':'+'}</span>
            {showCreate ? 'Cancel' : 'New Link'}
          </button>
        </div>

        {/* Stats row */}
        <div className="stat-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:40}}>
          {[
            {label:'Total Links',val:urls.length,color:'#e8e8f0'},
            {label:'Active Links',val:active,color:'#22d98a'},
            {label:'Expired',val:urls.length-active,color:'#ff6080'},
          ].map((s,i)=>(
            <div key={i} className="card-glass fu" style={{padding:'24px 28px',animationDelay:`${i*80}ms`}}>
              <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#5a5a7a',marginBottom:10}}>{s.label}</p>
              <p className="stat-num" style={{fontSize:56,color:s.color}}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="card-glass fu" style={{padding:32,marginBottom:32}}>
            <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#5a5a7a',marginBottom:20}}>Create New Link</p>
            <form onSubmit={handleShorten} autoComplete="off">
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <input className="input-field" placeholder="Paste your long URL (https://...)" value={form.originalUrl} onChange={e=>setForm({...form,originalUrl:e.target.value})} required autoComplete="off" />
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <input className="input-field" placeholder="Custom alias (optional)" value={form.customAlias} onChange={e=>setForm({...form,customAlias:e.target.value})} />
                  <input className="input-field" placeholder="Expires in days (optional)" type="number" value={form.expiryDays} onChange={e=>setForm({...form,expiryDays:e.target.value})} />
                </div>
                {err && <p style={{color:'#ff6080',fontSize:13,background:'rgba(255,96,128,0.06)',padding:'10px 14px',borderRadius:10}}>{err}</p>}
                <button className="btn-primary" type="submit" disabled={creating||!form.originalUrl} style={{borderRadius:12,justifyContent:'center',opacity:!form.originalUrl?0.5:1}}>
                  {creating ? <><Spinner/> Creating...</> : '⚡ Shorten URL'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="tab-bar">
          {[['links',`Links (${urls.length})`],['stats','Analytics']].map(([id,label])=>(
            <button key={id} className={`tab${tab===id?' active':''}`} onClick={()=>setTab(id)}>{label}</button>
          ))}
        </div>

        {/* Links tab */}
        {tab==='links' && (
          <div className="card-glass fu">
            {urls.length===0
              ? <div className="empty-state">
                  <div style={{fontFamily:'Bebas Neue',fontSize:64,color:'#1a1a2e'}}>EMPTY</div>
                  <p style={{color:'#5a5a7a',fontSize:15}}>No links yet. Create your first one above.</p>
                </div>
              : urls.map((url,i)=>(
                <div key={url.shortCode} className="link-row fi" style={{animationDelay:`${i*50}ms`}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:url.expiresAt&&new Date(url.expiresAt)<new Date()?'#ff6080':'#22d98a',flexShrink:0,boxShadow:`0 0 10px ${url.expiresAt&&new Date(url.expiresAt)<new Date()?'#ff6080':'#22d98a'}`}} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                      <a href={url.shortUrl} target="_blank" rel="noreferrer" style={{fontFamily:'JetBrains Mono',fontSize:14,color:'#7850ff',fontWeight:500}}>{url.shortUrl?.replace('http://localhost:8080/','/')}</a>
                      {url.expiresAt && <span style={{fontSize:11,color:'#fbbf24',background:'rgba(251,191,36,0.08)',padding:'2px 8px',borderRadius:100,letterSpacing:'0.05em'}}>EXP {new Date(url.expiresAt).toLocaleDateString()}</span>}
                    </div>
                    <p style={{color:'#4a4a6a',fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{url.originalUrl}</p>
                  </div>
                  <div style={{display:'flex',gap:6,flexShrink:0}}>
                    <button className="btn-ghost" style={{padding:'7px 14px',fontSize:12}} onClick={()=>copy(url.shortUrl)}>Copy</button>
                    <button className="btn-ghost" style={{padding:'7px 14px',fontSize:12}} onClick={()=>handleStats(url.shortCode)}>Stats</button>
                    <button className="btn-ghost" style={{padding:'7px 14px',fontSize:12,borderColor:'rgba(255,96,128,0.3)',color:'#ff6080'}} onClick={()=>handleDelete(url.shortCode)}>Delete</button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Stats tab */}
        {tab==='stats' && (
          <div className="fu">
            {!stats
              ? <div className="card-glass" style={{padding:48,textAlign:'center'}}>
                  <p style={{fontFamily:'Bebas Neue',fontSize:40,color:'#1a1a2e',marginBottom:8}}>NO DATA</p>
                  <p style={{color:'#5a5a7a',fontSize:14}}>Click "Stats" on any link to view analytics</p>
                </div>
              : <>
                <div className="card-glass" style={{padding:32,marginBottom:16}}>
                  <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#5a5a7a',marginBottom:12}}>Analyzing</p>
                  <a href={stats.shortUrl} target="_blank" rel="noreferrer" style={{fontFamily:'JetBrains Mono',fontSize:16,color:'#7850ff',display:'block',marginBottom:8}}>{stats.shortUrl}</a>
                  <p style={{color:'#4a4a6a',fontSize:13}}>{stats.originalUrl?.substring(0,80)}{stats.originalUrl?.length>80?'...':''}</p>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:16}}>
                  {[
                    {label:'Total Clicks',val:stats.totalClicks||0,color:'#7850ff'},
                    {label:'Created',val:stats.createdAt?new Date(stats.createdAt).toLocaleDateString():'—',color:'#22d98a'},
                    {label:'Expires',val:stats.expiresAt?new Date(stats.expiresAt).toLocaleDateString():'Never',color:'#fbbf24'},
                  ].map((s,i)=>(
                    <div key={i} className="card-glass" style={{padding:'20px 24px'}}>
                      <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#5a5a7a',marginBottom:8}}>{s.label}</p>
                      <p className="stat-num" style={{fontSize:40,color:s.color}}>{s.val}</p>
                    </div>
                  ))}
                </div>

                {stats.deviceBreakdown?.length>0 && (
                  <div className="card-glass" style={{padding:28}}>
                    <p style={{fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',color:'#5a5a7a',marginBottom:20}}>Device Breakdown</p>
                    {stats.deviceBreakdown.map((d,i)=>(
                      <div key={i} style={{marginBottom:16}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                          <span style={{fontSize:13,color:'#9090b0'}}>{d.deviceType}</span>
                          <span style={{fontFamily:'JetBrains Mono',fontSize:13,color:'#7850ff'}}>{d.count}</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width:`${Math.min((d.count/(stats.totalClicks||1))*100,100)}%`}} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>}
          </div>
        )}

        {/* Footer */}
        <div style={{marginTop:80,paddingTop:32,borderTop:'1px solid #12122a',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
          <p style={{fontFamily:'Bebas Neue',fontSize:22,letterSpacing:'0.06em',color:'#2a2a4a'}}>SHORTLINK</p>
          <p style={{fontSize:12,color:'#3a3a5a',fontFamily:'JetBrains Mono'}}>Built with Spring Boot · Redis · React</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));
  const logout = () => { localStorage.clear(); setAuth(false); };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={auth?<Navigate to="/dashboard"/>:<Auth onLogin={()=>setAuth(true)}/>} />
        <Route path="/dashboard" element={auth?<Dashboard onLogout={logout}/>:<Navigate to="/login"/>} />
        <Route path="*" element={<Navigate to={auth?'/dashboard':'/login'}/>} />
      </Routes>
    </BrowserRouter>
  );
}
