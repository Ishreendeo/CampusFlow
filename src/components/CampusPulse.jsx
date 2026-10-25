import { useEffect, useMemo, useState } from 'react';
import { useUser } from '../context/UserContext.jsx';

const readStore = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => readStore(key, initialValue));
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}

const initialAssignments = [
  { id: 1, title: 'OOP inheritance worksheet', course: 'Object Oriented Programming', due: '2026-10-28', done: false },
  { id: 2, title: 'SQL joins practice', course: 'Database Management', due: '2026-10-30', done: false },
  { id: 3, title: 'DSA complexity notes', course: 'Data Structures', due: '2026-11-02', done: true },
];
const initialReviews = [
  { id: 1, title: 'Inheritance worksheet', group: 'CSE-A', count: 28, status: 'Needs review' },
  { id: 2, title: 'SQL joins practice', group: 'CSE-B', count: 24, status: 'In progress' },
  { id: 3, title: 'DSA complexity quiz', group: 'CSE-A', count: 30, status: 'Reviewed' },
];

export default function CampusPulse() {
  const { role } = useUser();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('tasks');
  const [assignments, setAssignments] = useStoredState('cf-react-assignments-v1', initialAssignments);
  const [notes, setNotes] = useStoredState('cf-react-quick-notes-v1', []);
  const [reviews, setReviews] = useStoredState('cf-react-review-queue-v1', initialReviews);
  const [noteDraft, setNoteDraft] = useState('');
  const [taskDraft, setTaskDraft] = useState('');
  const [officeHours, setOfficeHours] = useStoredState('cf-react-office-hours-v1', false);
  const [announcement, setAnnouncement] = useStoredState('cf-react-announcements-v1', []);
  const [announcementDraft, setAnnouncementDraft] = useState('');

  useEffect(() => { setTab(role === 'faculty' ? 'reviews' : 'tasks'); }, [role]);

  const pending = useMemo(() => assignments.filter(a => !a.done).length, [assignments]);
  if (!role) return null;
  const isFaculty = role === 'faculty';

  function addAssignment(event) {
    event.preventDefault();
    const title = taskDraft.trim();
    if (!title) return;
    setAssignments(current => [{ id: Date.now(), title, course: 'Personal task', due: new Date().toISOString().slice(0, 10), done: false }, ...current]);
    setTaskDraft('');
  }
  function addNote(event) {
    event.preventDefault();
    const text = noteDraft.trim();
    if (!text) return;
    setNotes(current => [{ id: Date.now(), text, createdAt: new Date().toLocaleString() }, ...current].slice(0, 12));
    setNoteDraft('');
  }
  function addAnnouncement(event) {
    event.preventDefault();
    const text = announcementDraft.trim();
    if (!text) return;
    setAnnouncement(current => [{ id: Date.now(), text, createdAt: new Date().toLocaleString() }, ...current].slice(0, 8));
    setAnnouncementDraft('');
  }

  return <>
    <button className={`cpulse-launcher ${open ? 'is-open' : ''}`} onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Open quick tools">
      <span className="cpulse-launcher-icon">CF</span><span>{open ? 'Close tools' : 'Quick tools'}</span>{!open && <i>{isFaculty ? reviews.filter(r => r.status !== 'Reviewed').length : pending}</i>}
    </button>
    {open && <aside className="cpulse-panel" aria-label="Campus Flow quick tools">
      <header className="cpulse-head"><div><span className="cpulse-kicker">CAMPUS FLOW · {isFaculty ? 'FACULTY TOOLS' : 'STUDENT TOOLS'}</span><h2>{isFaculty ? 'Teacher tools' : 'Student tools'}</h2><p>{isFaculty ? 'Small tools for class work.' : 'Simple tools for keeping track of your work.'}</p></div><button className="cpulse-close" onClick={() => setOpen(false)} aria-label="Close">×</button></header>
      <nav className="cpulse-tabs" aria-label="Quick tools tabs">
        {(isFaculty ? [['reviews','Review queue'],['announce','Announcements']] : [['tasks','My tasks'],['notes','Quick notes']]).map(([id,label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}
      </nav>
      <div className="cpulse-body">
        {!isFaculty && tab === 'tasks' && <>
          <div className="cpulse-section-title"><div><span className="cpulse-kicker">PERSONAL PLANNER</span><h3>Assignment tracker</h3></div><span className="cpulse-count">{pending} open</span></div>
          <form className="cpulse-form" onSubmit={addAssignment}><input value={taskDraft} onChange={e => setTaskDraft(e.target.value)} placeholder="Add a task or assignment…" aria-label="New task" maxLength={90}/><button type="submit" aria-label="Add task">+</button></form>
          <div className="cpulse-list">{assignments.map(a => <label className={`cpulse-task ${a.done ? 'complete' : ''}`} key={a.id}><input type="checkbox" checked={a.done} onChange={() => setAssignments(current => current.map(item => item.id === a.id ? {...item, done: !item.done} : item))}/><span><strong>{a.title}</strong><small>{a.course} · Due {a.due}</small></span><button type="button" className="cpulse-delete" onClick={() => setAssignments(current => current.filter(item => item.id !== a.id))} aria-label={`Delete ${a.title}`}>×</button></label>)}</div>
        </>}
        {!isFaculty && tab === 'notes' && <><div className="cpulse-section-title"><div><span className="cpulse-kicker">SCRATCHPAD</span><h3>Quick notes</h3></div><span className="cpulse-count">Saved locally</span></div><form className="cpulse-note-form" onSubmit={addNote}><textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder="Remember a question, idea or small next step…" rows="3" maxLength={500} aria-label="Write a note"/><button className="cpulse-primary full" type="submit">Save note</button></form><div className="cpulse-list">{notes.map(n => <article className="cpulse-note" key={n.id}><p>{n.text}</p><small>{n.createdAt}</small><button className="cpulse-delete" onClick={() => setNotes(current => current.filter(item => item.id !== n.id))} aria-label="Delete note">×</button></article>)}{!notes.length && <p className="cpulse-empty">Your saved notes will appear here.</p>}</div></>}
        {isFaculty && tab === 'reviews' && <><div className="cpulse-section-title"><div><span className="cpulse-kicker">TEACHING WORKFLOW</span><h3>Assignment review queue</h3></div><span className="cpulse-count">{reviews.filter(r => r.status !== 'Reviewed').length} pending</span></div><p className="cpulse-subcopy">Demo records to show how review status changes interactively.</p><div className="cpulse-list">{reviews.map(r => <article className="cpulse-review" key={r.id}><div><strong>{r.title}</strong><small>{r.group} · {r.count} submissions</small></div><select aria-label={`Review status for ${r.title}`} value={r.status} onChange={e => setReviews(current => current.map(item => item.id === r.id ? {...item, status:e.target.value} : item))}><option>Needs review</option><option>In progress</option><option>Reviewed</option></select></article>)}</div></>}
        {isFaculty && tab === 'announce' && <><div className="cpulse-section-title"><div><span className="cpulse-kicker">CLASS COMMUNICATION</span><h3>Quick announcements</h3></div><span className="cpulse-count">{announcement.length} posted</span></div><form className="cpulse-note-form" onSubmit={addAnnouncement}><textarea value={announcementDraft} onChange={e => setAnnouncementDraft(e.target.value)} placeholder="Write a short class update…" rows="3" maxLength={300} aria-label="Write announcement"/><button className="cpulse-primary full" type="submit">Post update</button></form><div className="cpulse-list">{announcement.map(a => <article className="cpulse-note" key={a.id}><p>{a.text}</p><small>{a.createdAt}</small><button className="cpulse-delete" onClick={() => setAnnouncement(current => current.filter(item => item.id !== a.id))} aria-label="Delete announcement">×</button></article>)}{!announcement.length && <p className="cpulse-empty">Your class updates will appear here.</p>}</div></>}
      </div>
      <footer className="cpulse-footer"><span>CF</span> Campus Flow · Student project <span>Saved in this browser</span></footer>
    </aside>}
    {open && <button className="cpulse-scrim" onClick={() => setOpen(false)} aria-label="Close quick tools panel" />}
  </>;
}
