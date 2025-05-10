import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/ui/loader';
import { Sidebar, SidebarItem } from '../components/Sidebar';
import {
  LayoutDashboard,
  Home,
  StickyNote,
  Layers,
  Flag,
  Calendar,
  LifeBuoy,
  Settings,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate('/login');
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <SidebarItem icon={<Home size={20} />} text="Home" alert />
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active />
        <SidebarItem icon={<StickyNote size={20} />} text="Projects" alert />
        <SidebarItem icon={<Calendar size={20} />} text="Calendar" />
        <SidebarItem icon={<Layers size={20} />} text="Tasks" />
        <SidebarItem icon={<Flag size={20} />} text="Reporting" />
        <hr className="my-3" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
      </Sidebar>
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-gray-600 mb-4">Welcome, {user?.email}!</p>
        <button
          onClick={handleLogout}
          className="btn btn-destructive mt-4"
        >
          Logout
        </button>
      </main>
    </div>
  );
};

export default Dashboard; 