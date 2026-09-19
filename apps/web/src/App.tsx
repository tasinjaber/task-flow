import { useMemo, useState } from "react";
import { Bell, CalendarDays, CheckCircle2, ChevronDown, CircleHelp, Filter, LayoutDashboard, Menu, Plus, Search, Settings, SlidersHorizontal, Sparkles, Users, X } from "lucide-react";
import { projects as seedProjects, tasks as seedTasks } from "./data";
import type { Priority, Status, Task } from "./types";

const statusLabels: Record<Status,string> = {"todo":"To do","in-progress":"In progress","review":"In review","done":"Done"};
const priorityLabels: Record<Priority,string> = {low:"Low",medium:"Medium",high:"High"};

function App(){
 const [tasks,setTasks]=useState(seedTasks); const [query,setQuery]=useState(""); const [status,setStatus]=useState<Status|"all">("all"); const [sidebar,setSidebar]=useState(false); const [modal,setModal]=useState(false);
 const filtered=useMemo(()=>tasks.filter(t=>(status==="all"||t.status===status)&&t.title.toLowerCase().includes(query.toLowerCase())),[tasks,status,query]);
 const move=(id:string,next:Status)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,status:next}:t));
 const stats=[["Active tasks",tasks.filter(t=>t.status!=="done").length,"Across all projects"],["In review",tasks.filter(t=>t.status==="review").length,"Needs attention"],["Completed",tasks.filter(t=>t.status==="done").length,"This sprint"],["High priority",tasks.filter(t=>t.priority==="high").length,"Open items"]];
 return <div className="app">
  <aside className={sidebar?"sidebar open":"sidebar"}><div className="brand"><div className="brand-mark"><Sparkles size={18}/></div><strong>Task Flow</strong></div><nav><button className="active"><LayoutDashboard size={18}/>Overview</button><button><CheckCircle2 size={18}/>My tasks</button><button><CalendarDays size={18}/>Calendar</button><button><Users size={18}/>Team</button></nav><div className="side-section"><span>Workspace</span>{seedProjects.map(p=><button key={p.id}><span className={"dot "+p.color}></span>{p.name}</button>)}</div><div className="side-bottom"><button><Settings size={18}/>Settings</button><button><CircleHelp size={18}/>Help center</button></div></aside>
  {sidebar&&<button className="backdrop" onClick={()=>setSidebar(false)} aria-label="Close navigation"/>}
  <main><header><button className="mobile-menu" onClick={()=>setSidebar(true)}><Menu/></button><div className="crumb">Workspace <span>/</span> Overview</div><div className="header-actions"><button className="icon-btn"><Bell size={18}/><i/></button><div className="avatar">TJ</div></div></header>
  <section className="content"><div className="hero"><div><p className="eyebrow">Monday, September 21</p><h1>Good evening, Tasin.</h1><p className="muted">Here’s what’s happening across your workspace.</p></div><button className="primary" onClick={()=>setModal(true)}><Plus size={17}/>New task</button></div>
  <div className="stats">{stats.map(([label,value,caption])=><div className="stat" key={label}><span>{label}</span><strong>{value}</strong><small>{caption}</small></div>)}</div>
  <div className="layout"><section className="panel tasks-panel"><div className="panel-head"><div><h2>Tasks</h2><p>Keep your active work moving.</p></div><button className="ghost"><SlidersHorizontal size={16}/>View</button></div>
   <div className="toolbar"><div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks"/></div><div className="filters"><Filter size={15}/>{(["all","todo","in-progress","review","done"] as const).map(s=><button className={status===s?"selected":""} key={s} onClick={()=>setStatus(s)}>{s==="all"?"All":statusLabels[s]}</button>)}</div></div>
   <div className="task-list">{filtered.map(t=><TaskRow key={t.id} task={t} onMove={move}/>)}</div>
   {!filtered.length&&<div className="empty">No tasks match your current filters.</div>}
  </section><section className="panel projects"><div className="panel-head"><div><h2>Projects</h2><p>Delivery progress at a glance.</p></div><button className="ghost">All projects <ChevronDown size={15}/></button></div>{seedProjects.map(p=><div className="project" key={p.id}><div className="project-top"><div><span className={"project-dot "+p.color}></span><strong>{p.name}</strong><small>{p.client}</small></div><b>{p.progress}%</b></div><div className="progress"><span style={{width:p.progress+"%"}}/></div><div className="project-foot"><span>{p.tasks} tasks</span><span>Due {p.due}</span></div></div>)}</section></div>
  <section className="bottom-grid"><div className="tip"><div className="tip-icon"><Sparkles size={18}/></div><div><strong>Focus on what matters</strong><p>Start with high-priority tasks due this week to keep delivery on track.</p></div><button className="ghost" onClick={()=>setStatus("all")}>View priorities</button></div><div className="sprint"><span>SPRINT HEALTH</span><strong>82%</strong><p>On track · 4 days remaining</p></div></section>
  </section></main>
  {modal&&<NewTask onClose={()=>setModal(false)} onCreate={t=>{setTasks(x=>[t,...x]);setModal(false)}}/>}
 </div>
}

function TaskRow({task,onMove}:{task:Task;onMove:(id:string,next:Status)=>void}){
 const next:Status=task.status==="todo"?"in-progress":task.status==="in-progress"?"review":task.status==="review"?"done":"todo";
 return <article className="task-row"><button className={"check "+(task.status==="done"?"checked":"")} onClick={()=>onMove(task.id,next)} aria-label={"Move "+task.title}>{task.status==="done"&&<CheckCircle2 size={17}/>}</button><div className="task-main"><strong>{task.title}</strong><div><span className={"pill "+task.priority}>{priorityLabels[task.priority]}</span><span className="task-meta">{statusLabels[task.status]}</span><span className="task-meta">Due {task.due}</span></div></div><div className="assignee">{task.assignee}</div></article>
}

function NewTask({onClose,onCreate}:{onClose:()=>void;onCreate:(task:Task)=>void}){
 const [title,setTitle]=useState(""); const [priority,setPriority]=useState<Priority>("medium");
 return <div className="modal-wrap"><div className="modal"><div className="modal-head"><div><span className="eyebrow">New work item</span><h2>Create task</h2></div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div><label>Task title<input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Prepare launch checklist"/></label><label>Priority<select value={priority} onChange={e=>setPriority(e.target.value as Priority)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><div className="modal-actions"><button className="ghost" onClick={onClose}>Cancel</button><button className="primary" disabled={!title.trim()} onClick={()=>onCreate({id:"new-"+Date.now(),title:title.trim(),projectId:"p1",assignee:"TJ",status:"todo",priority,due:"Next week"})}>Create task</button></div></div></div>
}
export default App;