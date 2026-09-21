import React,{useEffect,useState} from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter,useNavigate,useLocation,useParams,Routes,Route,Link,Navigate,Outlet} from "react-router-dom";
import {createClient} from "@supabase/supabase-js";
import "./index.css";

const supabase =
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
    ? createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_ANON_KEY)
    : null;

function Home(){
  const nav=useNavigate();
  return <main className="app center"><div className="container" style={{textAlign:"center",maxWidth:800}}>
    <div style={{fontSize:24,fontWeight:900,color:"#22d3ee",marginBottom:20}}>C+</div>
    <h1 style={{fontSize:"clamp(42px,7vw,70px)",margin:"0 0 8px"}}>Conecta Mais 4.1</h1>
    <p style={{fontSize:22,color:"#cbd5e1"}}>Central de atendimento inteligente</p>
    <p className="muted">Uma entrada única para organizar solicitações, automatizar processos e gerar inteligência para a gestão.</p>
    <button className="btn primary" style={{marginTop:25,fontSize:17}} onClick={()=>nav("/solicitacao")}>Abrir uma solicitação</button>
    <div><button className="btn ghost" style={{marginTop:18}} onClick={()=>nav("/login")}>Acesso da equipe → Entrar</button></div>
  </div></main>
}

function Solicitacao(){
  const [sent,setSent]=useState(false),[protocol,setProtocol]=useState("");
  const [f,setF]=useState({nome:"",canal:"Site",assunto:"",mensagem:"",categoria:""});
  const nav=useNavigate(), set=(k,v)=>setF(x=>({...x,[k]:v}));
  if(sent)return <main className="app center"><div className="container" style={{maxWidth:650,textAlign:"center"}}><div className="card" style={{padding:35}}><div style={{fontSize:48}}>✓</div><h1>Solicitação registrada</h1><p className="muted">Seu protocolo:</p><div style={{fontSize:36,fontWeight:900,color:"#22d3ee"}}>{protocol}</div><button className="btn primary" style={{marginTop:24}} onClick={()=>nav("/protocolo/"+protocol)}>Acompanhar solicitação</button></div></div></main>
  return <main className="app" style={{padding:"45px 0"}}><div className="container" style={{maxWidth:760}}><button className="btn ghost" onClick={()=>nav("/")}>← Voltar</button><div className="card" style={{padding:30,marginTop:18}}><h1>Nova solicitação</h1><p className="muted">Preencha os dados. A classificação automática poderá ser integrada ao fluxo de IA.</p><form className="grid" style={{marginTop:25}} onSubmit={e=>{e.preventDefault();setProtocol("CT-"+String(Date.now()).slice(-6));setSent(true)}}><div><label className="label">Nome do cliente</label><input className="input" required value={f.nome} onChange={e=>set("nome",e.target.value)}/></div><div className="grid grid2"><div><label className="label">Canal de entrada</label><select className="input" value={f.canal} onChange={e=>set("canal",e.target.value)}><option>Site</option><option>WhatsApp</option><option>E-mail</option><option>Telefone</option></select></div><div><label className="label">Categoria</label><input className="input" placeholder="Ex.: Financeiro" value={f.categoria} onChange={e=>set("categoria",e.target.value)}/></div></div><div><label className="label">Assunto</label><input className="input" required value={f.assunto} onChange={e=>set("assunto",e.target.value)}/></div><div><label className="label">Mensagem / descrição</label><textarea className="input" rows="7" required value={f.mensagem} onChange={e=>set("mensagem",e.target.value)}/></div><button className="btn primary">Enviar solicitação</button></form></div></div></main>
}

function Protocolo(){const {id}=useParams();return <main className="app center"><div className="container" style={{maxWidth:650,textAlign:"center"}}><div className="card" style={{padding:35}}><p className="muted">Protocolo</p><h1 style={{color:"#22d3ee"}}>{id}</h1><p className="muted">O acompanhamento será conectado ao banco de dados na próxima etapa.</p><Link className="btn primary" to="/">Voltar ao início</Link></div></div></main>}

function Login(){
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(false);
  const nav=useNavigate();
  async function submit(e){e.preventDefault();setError("");if(!supabase){setError("O login real precisa das variáveis do Supabase. A estrutura do acesso já está preparada.");return}setLoading(true);const {error}=await supabase.auth.signInWithPassword({email,password});setLoading(false);if(error)setError("E-mail ou senha inválidos.");else nav("/dashboard")}
  return <main className="app center"><div className="container" style={{maxWidth:430}}><div className="card" style={{padding:30}}><h1>Acesso da equipe</h1><p className="muted">Área interna protegida.</p><form className="grid" onSubmit={submit} style={{marginTop:22}}><div><label className="label">E-mail</label><input className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></div><div><label className="label">Senha</label><input className="input" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></div>{error&&<div style={{color:"#fca5a5"}}>{error}</div>}<button className="btn primary">{loading?"Entrando...":"Entrar"}</button></form><button className="btn ghost" style={{width:"100%",marginTop:15}} onClick={()=>nav("/")}>← Área pública</button></div></div></main>
}

function Protected(){
  const [loading,setLoading]=useState(true),[auth,setAuth]=useState(false);
  useEffect(()=>{if(!supabase){setLoading(false);setAuth(false);return}supabase.auth.getSession().then(({data})=>{setAuth(!!data.session);setLoading(false)});const {data}=supabase.auth.onAuthStateChange((_e,s)=>setAuth(!!s));return()=>data.subscription.unsubscribe()},[]);
  if(loading)return <main className="app center">Verificando acesso...</main>;
  return auth?<Outlet/>:<Navigate to="/login" replace/>
}

function Internal(){
  const nav=useNavigate();
  async function sair(){if(supabase)await supabase.auth.signOut();nav("/")}
  return <div className="app"><header style={{borderBottom:"1px solid #24384a",padding:"18px 0"}}><div className="container" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:20}}><Link to="/dashboard" style={{textDecoration:"none",fontWeight:900,fontSize:20}}>C+ Conecta Mais</Link><nav style={{display:"flex",gap:15,flexWrap:"wrap"}}><Link to="/dashboard">Dashboard</Link><Link to="/atendimentos">Atendimentos</Link><Link to="/indicadores">Indicadores</Link><Link to="/configuracoes">Configurações</Link><button className="btn ghost" onClick={sair}>Sair</button></nav></div></header><div className="container" style={{padding:"30px 0"}}><Outlet/></div></div>
}

const InternalPage=({title,text})=><section><h1>{title}</h1><p className="muted">{text}</p><div className="card" style={{padding:25,marginTop:25}}>Estrutura preparada para a próxima integração do CONECTA MAIS 4.0.</div></section>;
function Dashboard(){return <section><h1>Dashboard</h1><p className="muted">Visão geral dos atendimentos.</p><div className="grid grid4" style={{marginTop:25}}>{["Solicitações","Abertas","Em andamento","Resolvidas"].map(x=><div className="card" style={{padding:22}} key={x}><span className="muted">{x}</span><div style={{fontSize:34,fontWeight:900,marginTop:8}}>—</div></div>)}</div></section>}
function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/solicitacao" element={<Solicitacao/>}/><Route path="/protocolo/:id" element={<Protocolo/>}/><Route path="/login" element={<Login/>}/><Route element={<Protected/>}><Route element={<Internal/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/atendimentos" element={<InternalPage title="Atendimentos" text="Solicitações, status, responsáveis e prioridades."/>}/><Route path="/indicadores" element={<InternalPage title="Indicadores" text="Power BI e inteligência gerencial."/>}/><Route path="/configuracoes" element={<InternalPage title="Configurações" text="Usuários, equipes, categorias, regras da IA e automações."/>}/></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
ReactDOM.createRoot(document.getElementById("root")).render(<BrowserRouter><App/></BrowserRouter>);