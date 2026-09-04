'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { continueWithGoogle } from '../auth-actions';

const apps = [
  { href: '/tvsync', name: 'TVSync', description: 'movie and tv show tracker' },
  { href: '/couple-planner', name: 'Couple Planner', description: 'shared agenda for couples' },
  { href: '/fithub', name: 'Fithub', description: 'track fitness like GitHub' },
];

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" width="18" height="18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.26-.16-1.86H9v3.52h4.84a4.14 4.14 0 0 1-1.8 2.72v2.28h2.92c1.71-1.57 2.68-3.9 2.68-6.66Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.28c-.8.54-1.84.86-3.04.86-2.35 0-4.34-1.59-5.05-3.72H.93v2.35A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.68A5.42 5.42 0 0 1 3.67 9c0-.58.1-1.14.28-1.68V4.97H.93A9 9 0 0 0 0 9c0 1.45.35 2.82.93 4.03l3.02-2.35Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A8.65 8.65 0 0 0 9 0 9 9 0 0 0 .93 4.97l3.02 2.35C4.66 5.18 6.65 3.58 9 3.58Z" />
    </svg>
  );
}

function LoginModal({ app, onClose }) {
  const dialogRef = useRef(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();

    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="auth-dialog"
      aria-labelledby="auth-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="auth-dialog-card">
        <button className="auth-dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close login">
          ×
        </button>
        <p id="auth-title" className="auth-dialog-title">{registering ? 'create an account' : 'login'}</p>
        <p className="auth-dialog-copy">
          {registering
            ? `register once to access ${app.name} and all apps`
            : `continue to ${app.name} with your account`}
        </p>
        <form action={continueWithGoogle}>
          <input type="hidden" name="callbackUrl" value={app.href} />
          <button className="google-button" type="submit">
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
        </form>
        {!registering && (
          <p className="auth-register-copy">
            not registered?{' '}
            <a href="#register" onClick={(event) => { event.preventDefault(); setRegistering(true); }}>
              register
            </a>
          </p>
        )}
        {registering && (
          <p className="auth-register-copy">
            already registered?{' '}
            <a href="#login" onClick={(event) => { event.preventDefault(); setRegistering(false); }}>
              login
            </a>
          </p>
        )}
      </div>
    </dialog>
  );
}

export default function AppsClient({ isAuthenticated }) {
  const [selectedApp, setSelectedApp] = useState(null);

  return (
    <>
      {apps.map((app) => (
        <p key={app.href}>
          <Link
            href={app.href}
            onClick={(event) => {
              if (!isAuthenticated) {
                event.preventDefault();
                setSelectedApp(app);
              }
            }}
          >
            [{app.name}]
          </Link>{' '}
          {app.status && `(${app.status})`}
          <br />
          {app.description}
        </p>
      ))}
      <Link href="/">[back to home]</Link>
      {selectedApp && <LoginModal app={selectedApp} onClose={() => setSelectedApp(null)} />}
    </>
  );
}
