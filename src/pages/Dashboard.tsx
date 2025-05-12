import { Button } from '@/components/ui/button';
import { signOutUser } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1>Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Dashboard; 