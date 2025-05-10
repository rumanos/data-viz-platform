import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/ui/loader';
import { Sidebar, SidebarItem } from '../components/Sidebar';
import {
  Menu,
  Home,
  StickyNote,
  Layers,
  Flag,
  Calendar,
  LifeBuoy,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const SIDEBAR_MENUS = [
  { key: 'home', label: 'Home', icon: <Home size={18} />, alert: true },
  { key: 'dashboard', label: 'Dashboard', icon: <Menu size={18} /> },
  { key: 'projects', label: 'Projects', icon: <StickyNote size={18} />, alert: true },
  { key: 'calendar', label: 'Calendar', icon: <Calendar size={18} /> },
  { key: 'tasks', label: 'Tasks', icon: <Layers size={18} /> },
  { key: 'reporting', label: 'Reporting', icon: <Flag size={18} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  { key: 'help', label: 'Help', icon: <LifeBuoy size={18} /> },
];

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  // Content for each menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'home':
        return <div className="p-6">Welcome Home!</div>;
      case 'dashboard':
        return (
          <div className="flex flex-col items-center justify-center border-t border-l border-[#525252] bg-[#161618] w-full h-full rounded-tl-lg">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <p className="text-gray-600 mb-4">Welcome, {user?.email}!</p>
            <Button onClick={handleLogout} className="mt-4">Logout</Button>
          </div>
        );
      case 'projects':
        return <div className="p-6">Projects content goes here.</div>;
      case 'calendar':
        return <div className="p-6">Calendar content goes here.</div>;
      case 'tasks':
        return <div className="p-6">Tasks content goes here.</div>;
      case 'reporting':
        return <div className="p-6">Reporting content goes here.</div>;
      case 'settings':
        return <div className="p-6">Settings content goes here.</div>;
      case 'help':
        return <div className="p-6">Help content goes here.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar>
          {SIDEBAR_MENUS.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              text={item.label}
              alert={item.alert}
              selected={selectedMenu === item.key}
              onClick={() => setSelectedMenu(item.key)}
            />
          ))}
        </Sidebar>
      </div>
      {/* Mobile sidebar drawer */}
      <div>
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              className="fixed top-4 left-4 z-50 md:hidden"
              variant="ghost"
              size="icon"
              aria-label="Open sidebar"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 h-screen max-w-full left-0 top-0 rounded-none border-none shadow-xl md:hidden">
            <Sidebar mobileOpen onMobileClose={() => setMobileSidebarOpen(false)}>
              {SIDEBAR_MENUS.map((item) => (
                <SidebarItem
                  key={item.key}
                  icon={item.icon}
                  text={item.label}
                  alert={item.alert}
                  selected={selectedMenu === item.key}
                  onClick={() => {
                    setSelectedMenu(item.key);
                    setMobileSidebarOpen(false);
                  }}
                />
              ))}
            </Sidebar>
          </SheetContent>
        </Sheet>
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center w-full min-h-screen">
        <header className="flex flex-col items-center justify-center h-16" />
        <div className="w-full h-full flex flex-col items-center justify-center">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 