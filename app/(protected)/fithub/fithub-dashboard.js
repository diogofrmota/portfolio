'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './fithub.module.css';

const defaultGoals = [
  { id: 'gym', label: 'Go to the gym', detail: 'Strength session', icon: 'dumbbell' },
  { id: 'run', label: 'Run 5 km', detail: 'Outdoor or treadmill', icon: 'run' },
  { id: 'water', label: 'Drink 4 liters of water', detail: '8 of 8 glasses', icon: 'water' },
  { id: 'supplements', label: 'Take supplements', detail: 'Creatine, protein & omega 3', icon: 'supplement' },
];

const defaultWorkouts = [
  {
    id: 'push',
    day: 'Monday',
    title: 'Push day',
    exercises: ['Bench press · 4 × 8', 'Overhead press · 3 × 10', 'Cable fly · 3 × 12'],
    tone: 'lime',
  },
  {
    id: 'lower',
    day: 'Wednesday',
    title: 'Lower body',
    exercises: ['Back squat · 4 × 6', 'Romanian deadlift · 3 × 8', 'Leg press · 3 × 12'],
    tone: 'mint',
  },
  {
    id: 'pull',
    day: 'Friday',
    title: 'Pull day',
    exercises: ['Pull ups · 4 × 6', 'Barbell row · 4 × 8', 'Face pulls · 3 × 15'],
    tone: 'forest',
  },
];

const storageKey = 'fithub-dashboard-v1';
const dayNames = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function Icon({ name, size = 20 }) {
  const paths = {
    dumbbell: <><path d="M6 7v10M3.5 9v6M18 7v10M20.5 9v6M6 12h12" /><path d="M2 10v4M22 10v4" /></>,
    run: <><circle cx="14.5" cy="4.5" r="2" /><path d="m12 9 3-1 2.5 2.5M8 21l3-5 2-4 4 3 1 4M6 13l3-4 3 1" /></>,
    water: <path d="M12 3S6.5 9.2 6.5 14a5.5 5.5 0 0 0 11 0C17.5 9.2 12 3 12 3Z" />,
    supplement: <><path d="M8.5 5.5a4.24 4.24 0 0 1 6 6l-4 4a4.24 4.24 0 0 1-6-6l4-4Z" /><path d="m8 12 4 4" /></>,
    flame: <path d="M12 22c4.4 0 7-3.1 7-7.1 0-3.3-2-6.1-5.2-9.4.1 2.5-1.5 4.2-2.7 4.9.1-3.6-1.8-6-3.1-7.4.1 3.7-3 5.9-3 10.8C5 18.5 7.8 22 12 22Z" />,
    check: <path d="m5 12 4.3 4.3L19 6.7" />,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" /></>,
  };

  return (
    <svg className={styles.icon} aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function buildActivity(today) {
  const end = new Date(`${today}T12:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 363 - start.getUTCDay());

  return Array.from({ length: 371 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const dateKey = date.toISOString().slice(0, 10);
    const seed = (index * 17 + date.getUTCMonth() * 11) % 29;
    const isFuture = date > end;
    const level = isFuture || dateKey === today || seed < 10 ? 0 : seed < 17 ? 1 : seed < 23 ? 2 : seed < 27 ? 3 : 4;
    return { date: dateKey, level };
  });
}

function ActivityGrid({ activity, today }) {
  const weeks = useMemo(() => {
    const grouped = [];
    for (let index = 0; index < activity.length; index += 7) grouped.push(activity.slice(index, index + 7));
    return grouped;
  }, [activity]);

  const months = useMemo(() => {
    const labels = [];
    let previous = -1;
    weeks.forEach((week, index) => {
      const month = new Date(`${week[0].date}T12:00:00Z`).getUTCMonth();
      if (month !== previous && index < weeks.length - 2) {
        labels.push({ index, label: new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(new Date(`${week[0].date}T12:00:00Z`)) });
        previous = month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className={styles.chartScroll}>
      <div className={styles.chart}>
        <div className={styles.months} aria-hidden="true">
          {months.map((month) => <span key={`${month.label}-${month.index}`} style={{ gridColumnStart: month.index + 1 }}>{month.label}</span>)}
        </div>
        <div className={styles.chartBody}>
          <div className={styles.dayLabels} aria-hidden="true">
            {dayNames.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
          </div>
          <div className={styles.weeks} role="grid" aria-label="Gym activity over the last year">
            {weeks.map((week, weekIndex) => (
              <div className={styles.week} role="row" key={week[0].date}>
                {week.map((day) => (
                  <span
                    className={`${styles.activityDay} ${styles[`level${day.level}`]} ${day.date === today ? styles.today : ''}`}
                    key={day.date}
                    role="gridcell"
                    title={`${day.date}: ${day.level ? 'gym visit logged' : 'no gym visit'}`}
                    aria-label={`${day.date}: ${day.level ? 'gym visit logged' : 'no gym visit'}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FithubDashboard({ today }) {
  const [completed, setCompleted] = useState(['water']);
  const [activity, setActivity] = useState(() => buildActivity(today));
  const [workouts, setWorkouts] = useState(defaultWorkouts);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey));
      if (saved?.activity) {
        setActivity(saved.activity);
        const hasGymVisit = saved.activity.some((day) => day.date === today && day.level > 0);
        const savedGoals = saved.completed ?? [];
        setCompleted(hasGymVisit ? [...new Set([...savedGoals, 'gym'])] : savedGoals.filter((id) => id !== 'gym'));
      } else if (saved?.completed) {
        setCompleted(saved.completed.filter((id) => id !== 'gym'));
      }
      if (saved?.workouts) setWorkouts(saved.workouts);
    } catch {
      // Keep the useful defaults when storage is unavailable or malformed.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ completed, activity, workouts }));
  }, [activity, completed, ready, workouts]);

  const gymLogged = activity.some((day) => day.date === today && day.level > 0);
  const completion = Math.round((completed.length / defaultGoals.length) * 100);
  const visitCount = activity.filter((day) => day.level > 0).length;

  function toggleGoal(goalId) {
    setCompleted((current) => current.includes(goalId) ? current.filter((id) => id !== goalId) : [...current, goalId]);
  }

  function toggleGymVisit() {
    setActivity((current) => current.map((day) => day.date === today ? { ...day, level: day.level ? 0 : 4 } : day));
    setCompleted((current) => gymLogged ? current.filter((id) => id !== 'gym') : [...new Set([...current, 'gym'])]);
  }

  function addWorkout(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const exercises = data.get('exercises').split('\n').map((item) => item.trim()).filter(Boolean);
    const workout = {
      id: `${Date.now()}`,
      day: data.get('day'),
      title: data.get('title').trim(),
      exercises,
      tone: ['lime', 'mint', 'forest'][workouts.length % 3],
    };
    setWorkouts((current) => [...current, workout]);
    setShowWorkoutForm(false);
    event.currentTarget.reset();
  }

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div>
            <div className={styles.eyebrow}><span className={styles.pulse} /> Fithub dashboard</div>
            <h1>Build your streak.<br /><span>Own your progress.</span></h1>
            <p>Small actions, repeated daily. Keep your training, habits, and plan together.</p>
          </div>
          <button className={`${styles.logButton} ${gymLogged ? styles.logged : ''}`} type="button" onClick={toggleGymVisit}>
            <Icon name={gymLogged ? 'check' : 'plus'} />
            {gymLogged ? 'Gym visit logged' : 'Log today’s gym visit'}
          </button>
        </section>

        <section className={styles.activityCard} aria-labelledby="activity-title">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.kicker}>Consistency</span>
              <h2 id="activity-title">Your year in motion</h2>
            </div>
            <div className={styles.statRow}>
              <div><strong>{visitCount}</strong><span>gym days</span></div>
              <div><strong>7</strong><span>week streak</span></div>
              <div className={styles.streak}><Icon name="flame" /><strong>18</strong><span>best streak</span></div>
            </div>
          </div>
          <ActivityGrid activity={activity} today={today} />
          <div className={styles.legend} aria-label="Activity intensity legend">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => <i className={`${styles.activityDay} ${styles[`level${level}`]}`} key={level} />)}
            <span>More</span>
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.goalsCard} aria-labelledby="goals-title">
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.kicker}>Today</span>
                <h2 id="goals-title">Daily goals</h2>
              </div>
              <div className={styles.progressLabel}>{completed.length}/{defaultGoals.length}</div>
            </div>
            <div className={styles.progressTrack} aria-label={`${completion}% of today's goals complete`}>
              <span style={{ width: `${completion}%` }} />
            </div>
            <div className={styles.goalList}>
              {defaultGoals.map((goal) => {
                const isDone = completed.includes(goal.id);
                return (
                  <button className={`${styles.goal} ${isDone ? styles.goalDone : ''}`} type="button" key={goal.id} onClick={() => goal.id === 'gym' ? toggleGymVisit() : toggleGoal(goal.id)} aria-pressed={isDone}>
                    <span className={styles.goalIcon}><Icon name={goal.icon} /></span>
                    <span className={styles.goalCopy}><strong>{goal.label}</strong><small>{goal.detail}</small></span>
                    <span className={styles.checkbox}>{isDone && <Icon name="check" size={15} />}</span>
                  </button>
                );
              })}
            </div>
            <div className={styles.goalFooter}>
              <span>{completion}% complete</span>
              <span>{completion === 100 ? 'Perfect day.' : 'Keep going — you’re building momentum.'}</span>
            </div>
          </section>

          <aside className={styles.todayCard}>
            <span className={styles.kicker}>Next workout</span>
            <div className={styles.todayIcon}><Icon name="calendar" size={24} /></div>
            <p className={styles.todayDay}>{workouts[0]?.day ?? 'No session planned'}</p>
            <h2>{workouts[0]?.title ?? 'Build your plan'}</h2>
            <p>{workouts[0]?.exercises.length ?? 0} exercises · Around 60 min</p>
            <button type="button" onClick={() => document.getElementById('workout-plan')?.scrollIntoView({ behavior: 'smooth' })}>
              View workout <Icon name="arrow" size={17} />
            </button>
          </aside>
        </div>

        <section className={styles.planSection} id="workout-plan" aria-labelledby="plan-title">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.kicker}>Weekly split</span>
              <h2 id="plan-title">Workout plan</h2>
              <p>Structure your week and show up knowing exactly what to do.</p>
            </div>
            <button className={styles.addButton} type="button" onClick={() => setShowWorkoutForm((current) => !current)} aria-expanded={showWorkoutForm}>
              <Icon name={showWorkoutForm ? 'check' : 'plus'} size={18} /> {showWorkoutForm ? 'Done' : 'Add workout'}
            </button>
          </div>

          {showWorkoutForm && (
            <form className={styles.workoutForm} onSubmit={addWorkout}>
              <label>
                Day
                <select name="day" defaultValue="Tuesday">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => <option key={day}>{day}</option>)}
                </select>
              </label>
              <label>
                Workout name
                <input name="title" placeholder="e.g. Upper body" required />
              </label>
              <label className={styles.exerciseField}>
                Exercises <span>One per line</span>
                <textarea name="exercises" placeholder={'Incline press · 4 × 8\nLat pulldown · 3 × 10'} rows="3" required />
              </label>
              <button type="submit">Save workout</button>
            </form>
          )}

          <div className={styles.workoutGrid}>
            {workouts.map((workout, index) => (
              <article className={`${styles.workoutCard} ${styles[workout.tone]}`} key={workout.id}>
                <div className={styles.workoutTop}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <button type="button" onClick={() => setWorkouts((current) => current.filter((item) => item.id !== workout.id))} aria-label={`Delete ${workout.title}`} title="Delete workout">
                    <Icon name="trash" size={17} />
                  </button>
                </div>
                <p>{workout.day}</p>
                <h3>{workout.title}</h3>
                <ul>
                  {workout.exercises.map((exercise, exerciseIndex) => <li key={`${exercise}-${exerciseIndex}`}>{exercise}</li>)}
                </ul>
              </article>
            ))}
            {workouts.length === 0 && (
              <div className={styles.emptyPlan}>
                <Icon name="dumbbell" size={26} />
                <h3>Your week is wide open</h3>
                <p>Add your first workout to start building a routine.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
