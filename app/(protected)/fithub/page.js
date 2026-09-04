import FithubDashboard from './fithub-dashboard';

export const metadata = {
  title: 'Fithub',
  description: 'Build consistency, one workout at a time.',
};

export default function Fithub() {
  const today = new Date().toISOString().slice(0, 10);

  return <FithubDashboard today={today} />;
}
