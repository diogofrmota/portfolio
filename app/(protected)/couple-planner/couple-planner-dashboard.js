'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './couple-planner.module.css';

const STORAGE_KEY = 'couple-planner-dashboard-v1';

const sections = [
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'tasks', label: 'Tasks', icon: 'check' },
  { id: 'dates', label: 'Dates', icon: 'pin' },
  { id: 'trips', label: 'Trips', icon: 'plane' },
  { id: 'recipes', label: 'Recipes', icon: 'chef' },
  { id: 'entertainment', label: 'Entertainment', icon: 'play' },
];

const sectionMeta = {
  calendar: { title: 'Calendar', copy: 'Everything you are looking forward to, in one place.', action: 'Add activity' },
  tasks: { title: 'Tasks', copy: 'Keep the little things moving, together.', action: 'Add task' },
  dates: { title: 'Date ideas', copy: 'Save the places and plans you want to experience.', action: 'Add date idea' },
  trips: { title: 'Trips', copy: 'Plan the next escape from the first idea to takeoff.', action: 'Add trip' },
  recipes: { title: 'Recipes', copy: 'A shared cookbook for weeknights and slow Sundays.', action: 'Add recipe' },
  entertainment: { title: 'Entertainment', copy: 'Keep your next watch, read, and listen close.', action: 'Add a pick' },
};

function Icon({ name, size = 20 }) {
  const paths = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="m8 12 2.5 2.5L16 9" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    plane: <><path d="m3 11 18-7-7 18-3-8-8-3Z" /><path d="m11 14 4-4" /></>,
    chef: <><path d="M6 13a4 4 0 0 1 1-7.87A5 5 0 0 1 17 6a4 4 0 0 1 1 7" /><path d="M6 13v7h12v-7M9 16v4M15 16v4" /></>,
    play: <><rect x="3" y="5" width="18" height="15" rx="3" /><path d="m10 9 5 3.5-5 3.5V9ZM8 2l4 3 4-3" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    left: <path d="m15 18-6-6 6-6" />,
    right: <path d="m9 18 6-6-6-6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-4 2.7-6 6-6s6 2 6 6M16 5.5a3 3 0 0 1 0 5.8M17 14c2.5.4 4 2.2 4 5" /></>,
  };
  return <svg className={styles.icon} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function addDays(iso, days) {
  const value = new Date(`${iso}T12:00:00`);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
}

function defaultData(today, userName) {
  return {
    calendar: [
      { id: 'event-1', title: 'Dinner at Farta Brutos', date: addDays(today, 2), detail: '20:00', color: '#e63b2e' },
      { id: 'event-2', title: 'Sunday market', date: addDays(today, 5), detail: '10:30', color: '#d68b32' },
      { id: 'event-3', title: 'Weekend away', date: addDays(today, 11), detail: 'All day', color: '#476f60' },
    ],
    tasks: [
      { id: 'task-1', title: 'Book the restaurant', detail: 'For Friday evening', date: addDays(today, 1), done: false },
      { id: 'task-2', title: 'Choose a film for movie night', detail: 'Assigned to both', date: addDays(today, 3), done: false },
      { id: 'task-3', title: 'Water the plants', detail: `Completed by ${userName}`, date: today, done: true },
    ],
    dates: [
      { id: 'date-1', title: 'Ceramics workshop', detail: 'Creative · Saved for later', tag: 'Want to go' },
      { id: 'date-2', title: 'Sunset picnic in Monsanto', detail: 'Outdoors · Lisbon', tag: 'Favourite' },
    ],
    trips: [{ id: 'trip-1', title: 'Madeira', detail: '5 nights · Flights saved', date: addDays(today, 42), tag: 'Planning' }],
    recipes: [
      { id: 'recipe-1', title: 'Mushroom risotto', detail: '45 min · Dinner', tag: 'Favourite' },
      { id: 'recipe-2', title: 'Lemon olive oil cake', detail: '1 hr · Dessert', tag: 'To try' },
    ],
    entertainment: [
      { id: 'media-1', title: 'Past Lives', detail: 'Movie · 2023', tag: 'Watch together' },
      { id: 'media-2', title: 'The Bear', detail: 'TV show · Season 3', tag: 'Watching' },
      { id: 'media-3', title: 'Tomorrow, and Tomorrow, and Tomorrow', detail: 'Book · Gabrielle Zevin', tag: 'To read' },
    ],
  };
}

function formatDate(iso, options = {}) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...options }).format(new Date(`${iso}T12:00:00Z`));
}

function Calendar({ items, cursor, setCursor, today }) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousDays = new Date(year, month, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const raw = index - mondayOffset + 1;
    if (raw < 1) return { day: previousDays + raw, muted: true, monthOffset: -1 };
    if (raw > daysInMonth) return { day: raw - daysInMonth, muted: true, monthOffset: 1 };
    return { day: raw, muted: false, monthOffset: 0 };
  });
  const dateFor = (cell) => {
    const value = new Date(year, month + cell.monthOffset, cell.day, 12);
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.calendarLayout}>
      <section className={styles.calendarCard} aria-label="Monthly calendar">
        <div className={styles.calendarToolbar}>
          <h2>{new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(cursor)}</h2>
          <div className={styles.calendarControls}>
            <button type="button" onClick={() => setCursor(new Date())}>Today</button>
            <button type="button" aria-label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))}><Icon name="left" /></button>
            <button type="button" aria-label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))}><Icon name="right" /></button>
          </div>
        </div>
        <div className={styles.weekdays}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}</div>
        <div className={styles.monthGrid}>
          {cells.map((cell, index) => {
            const iso = dateFor(cell);
            const dayItems = items.filter((item) => item.date === iso);
            return <div className={`${styles.day} ${cell.muted ? styles.mutedDay : ''} ${iso === today ? styles.today : ''}`} key={`${iso}-${index}`}><span>{cell.day}</span>{dayItems.slice(0, 2).map((item) => <div className={styles.calendarEvent} style={{ '--event-color': item.color || '#e63b2e' }} key={item.id}>{item.title}</div>)}{dayItems.length > 2 && <small>+{dayItems.length - 2} more</small>}</div>;
          })}
        </div>
      </section>
      <aside className={styles.upNext}>
        <span className={styles.eyebrow}>Up next</span><h3>Your plans</h3>
        <div className={styles.agendaList}>{[...items].sort((a, b) => a.date.localeCompare(b.date)).filter((item) => item.date >= today).slice(0, 4).map((item) => <article key={item.id}><time dateTime={item.date}><strong>{formatDate(item.date, { day: '2-digit' })}</strong><span>{formatDate(item.date, { month: 'short' })}</span></time><div><h4>{item.title}</h4><p>{item.detail || 'All day'}</p></div></article>)}</div>
      </aside>
    </div>
  );
}

function TaskList({ items, onToggle, onDelete }) {
  const active = items.filter((item) => !item.done);
  const completed = items.filter((item) => item.done);
  return <div className={styles.taskColumns}><section className={styles.listSection}><div className={styles.listTitle}><h2>To do</h2><span>{active.length}</span></div><div className={styles.taskList}>{active.map((item) => <Task key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} />)}{!active.length && <EmptyState title="Everything is done" copy="A clear list feels good. Add something when you are ready." />}</div></section><section className={styles.listSection}><div className={styles.listTitle}><h2>Completed</h2><span>{completed.length}</span></div><div className={styles.taskList}>{completed.map((item) => <Task key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} />)}{!completed.length && <EmptyState title="Nothing checked off yet" copy="Completed tasks will collect here." />}</div></section></div>;
}

function Task({ item, onToggle, onDelete }) {
  return <article className={`${styles.task} ${item.done ? styles.taskDone : ''}`}><button className={styles.checkbox} type="button" onClick={() => onToggle(item.id)} aria-label={`${item.done ? 'Reopen' : 'Complete'} ${item.title}`} aria-pressed={item.done}>{item.done && <Icon name="check" size={15} />}</button><div><h3>{item.title}</h3><p>{item.detail}</p>{item.date && <time dateTime={item.date}>Due {formatDate(item.date, { day: 'numeric', month: 'short' })}</time>}</div><button className={styles.deleteButton} type="button" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`}><Icon name="trash" size={17} /></button></article>;
}

function Collection({ items, section, onDelete }) {
  if (!items.length) return <EmptyState title={`No ${sectionMeta[section].title.toLowerCase()} yet`} copy="Add the first one to your shared space." />;
  return <div className={styles.collectionGrid}>{items.map((item, index) => <article className={`${styles.collectionCard} ${styles[`tone${index % 4}`]}`} key={item.id}><div className={styles.cardTop}><span>{item.tag || sectionMeta[section].title}</span><button type="button" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`}><Icon name="trash" size={17} /></button></div><div className={styles.cardIcon}><Icon name={sections.find((entry) => entry.id === section)?.icon || 'heart'} size={24} /></div><h2>{item.title}</h2><p>{item.detail || 'Shared with your partner'}</p>{item.date && <time dateTime={item.date}>{formatDate(item.date, { day: 'numeric', month: 'long', year: 'numeric' })}</time>}</article>)}</div>;
}

function EmptyState({ title, copy }) {
  return <div className={styles.emptyState}><span><Icon name="heart" /></span><h3>{title}</h3><p>{copy}</p></div>;
}

function AddDialog({ section, onClose, onSubmit }) {
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const meta = sectionMeta[section];
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit({ title: form.get('title').trim(), detail: form.get('detail').trim(), date: form.get('date') || undefined, tag: form.get('tag')?.trim() || undefined, color: '#e63b2e', done: false });
  }

  return <div className={styles.backdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="add-dialog-title"><button className={styles.dialogClose} type="button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button><span className={styles.eyebrow}>Shared space</span><h2 id="add-dialog-title">{meta.action}</h2><p>Add the details now. You can always refine the plan together later.</p><form onSubmit={submit}><label>Title<input ref={inputRef} name="title" required maxLength="80" placeholder={section === 'tasks' ? 'What needs doing?' : `Name your ${section === 'calendar' ? 'activity' : 'idea'}`} /></label><label>Details<textarea name="detail" rows="3" maxLength="180" placeholder="Add a useful note (optional)" /></label>{(section === 'calendar' || section === 'tasks' || section === 'trips') && <label>Date<input name="date" type="date" required={section === 'calendar'} /></label>}{section !== 'calendar' && section !== 'tasks' && <label>Status or category<input name="tag" maxLength="30" placeholder="e.g. Favourite, Planning" /></label>}<div className={styles.formActions}><button type="button" onClick={onClose}>Cancel</button><button type="submit">Save to our space</button></div></form></section></div>;
}

export default function CouplePlannerDashboard({ userName, today }) {
  const [active, setActive] = useState('calendar');
  const [data, setData] = useState(() => defaultData(today, userName));
  const [cursor, setCursor] = useState(() => new Date(`${today}T12:00:00`));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)); if (saved && typeof saved === 'object') setData((current) => ({ ...current, ...saved })); } catch { /* Keep defaults when storage is unavailable or malformed. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data, ready]);

  const upcomingCount = useMemo(() => data.calendar.filter((item) => item.date >= today).length, [data.calendar, today]);
  const pendingCount = useMemo(() => data.tasks.filter((item) => !item.done).length, [data.tasks]);
  const meta = sectionMeta[active];
  function addItem(item) { setData((current) => ({ ...current, [active]: [...current[active], { ...item, id: `${active}-${Date.now()}` }] })); setDialogOpen(false); }
  function deleteItem(id) { setData((current) => ({ ...current, [active]: current[active].filter((item) => item.id !== id) })); }
  function toggleTask(id) { setData((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task) })); }

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}><div className={styles.brand}><span><Icon name="heart" size={18} /></span><div><strong>Couple Planner</strong><small>Our shared space</small></div></div><nav aria-label="Couple Planner sections">{sections.map((section) => <button className={active === section.id ? styles.activeNav : ''} type="button" key={section.id} onClick={() => setActive(section.id)}><Icon name={section.icon} /><span>{section.label}</span>{section.id === 'tasks' && pendingCount > 0 && <small>{pendingCount}</small>}</button>)}</nav><div className={styles.sidebarFooter}><div className={styles.avatars}><span>{userName.charAt(0).toUpperCase()}</span><span>+</span></div><div><strong>{userName}</strong><small>Invite your partner</small></div></div></aside>
      <div className={styles.workspace}>
        <header className={styles.mobileHeader}><div className={styles.brand}><span><Icon name="heart" size={17} /></span><div><strong>Couple Planner</strong><small>Our shared space</small></div></div><div className={styles.avatars}><span>{userName.charAt(0).toUpperCase()}</span></div></header>
        <main className={styles.content}><div className={styles.pageHeader}><div><span className={styles.eyebrow}><Icon name="users" size={14} /> Made for two</span><h1>{meta.title}</h1><p>{meta.copy}</p></div><button className={styles.primaryButton} type="button" onClick={() => setDialogOpen(true)}><Icon name="plus" size={18} />{meta.action}</button></div><div className={styles.summary} aria-label="Planner summary"><span><strong>{upcomingCount}</strong> upcoming plans</span><i /><span><strong>{pendingCount}</strong> open tasks</span><i /><span><strong>{data.dates.length + data.trips.length}</strong> saved adventures</span></div>{active === 'calendar' && <Calendar items={data.calendar} cursor={cursor} setCursor={setCursor} today={today} />}{active === 'tasks' && <TaskList items={data.tasks} onToggle={toggleTask} onDelete={deleteItem} />}{!['calendar', 'tasks'].includes(active) && <Collection items={data[active]} section={active} onDelete={deleteItem} />}</main>
        <nav className={styles.mobileNav} aria-label="Couple Planner mobile sections">{sections.map((section) => <button className={active === section.id ? styles.activeMobileNav : ''} type="button" key={section.id} onClick={() => setActive(section.id)}><Icon name={section.icon} size={19} /><span>{section.label === 'Entertainment' ? 'Media' : section.label}</span></button>)}</nav>
      </div>
      {dialogOpen && <AddDialog section={active} onClose={() => setDialogOpen(false)} onSubmit={addItem} />}
    </div>
  );
}
