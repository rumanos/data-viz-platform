import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/ui/loader';
import { Sidebar, SidebarItem } from '../components/Sidebar';
import {
  AlignJustify,
  Home as HomeIcon,
  Bell,
  ClipboardList,
  CloudUpload,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSidebarStore } from '../store/sidebarStore';
import { cn } from '@/lib/utils';

const SIDEBAR_MENUS = [
  { key: 'home', label: 'Home', icon: <HomeIcon size={20} /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell size={20} />, alert: false },
  { key: 'tasks', label: 'Tasks', icon: <ClipboardList size={20} /> },
  { key: 'upload', label: 'Upload', icon: <CloudUpload size={20} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const expanded = useSidebarStore((state) => state.expanded);
  const setExpanded = useSidebarStore((state) => state.setExpanded);
  const prevExpandedRef = useRef<boolean | null>(null);
  const navigate = useNavigate();
  const { menuKey } = useParams<{ menuKey: string }>();
  const validMenuKeys = SIDEBAR_MENUS.map((item) => item.key);
  const selectedMenu = validMenuKeys.includes(menuKey || '') ? menuKey! : 'home';

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

  useEffect(() => {
    if (!menuKey || !validMenuKeys.includes(menuKey)) {
      navigate('/home', { replace: true });
    }
  }, [menuKey, navigate, validMenuKeys]);

  // Effect to handle expanded state for mobile sidebar
  useEffect(() => {
    if (mobileSidebarOpen) {
      // Store previous expanded value and set expanded to true
      prevExpandedRef.current = expanded;
      setExpanded(true);
    } else {
      // Restore previous expanded value if it exists
      if (prevExpandedRef.current !== null) {
        setExpanded(prevExpandedRef.current);
        prevExpandedRef.current = null;
      }
    }
    // Only run when mobileSidebarOpen changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileSidebarOpen]);

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
        return <div className="p-6">Home content goes here.</div>;
      case 'notifications':
        return <div className="p-6">Notifications content goes here.</div>;
      case 'tasks':
        return <div className="p-6">Tasks content goes here.</div>;
      case 'upload':
        return <div className="p-6">Upload content goes here.</div>;
      case 'settings':
        return <div className="p-6">Settings content goes here.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar>
        {SIDEBAR_MENUS.map((item) => (
          <SidebarItem
            key={item.key}
            icon={item.icon}
            text={item.label}
            alert={item.alert}
            selected={selectedMenu === item.key}
            onClick={() => navigate(`/${item.key}`)}
          />
        ))}
      </Sidebar>
      {/* Mobile sidebar drawer */}
      <div>
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              className="fixed top-4 left-4 z-50 md:hidden flex items-center gap-2 px-3 py-2"
              variant="ghost"
              aria-label="Open sidebar"
            >
              <AlignJustify className="w-6 h-6" />
              <span className="text-white font-medium text-base truncate max-w-[120px]">{SIDEBAR_MENUS.find((item) => item.key === selectedMenu)?.label}</span>
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
                    navigate(`/${item.key}`);
                    setMobileSidebarOpen(false);
                  }}
                />
              ))}
            </Sidebar>
          </SheetContent>
        </Sheet>
      </div>
      
      <main className={cn(
        "flex-1 flex flex-col items-center justify-center w-full min-h-screen transition-all duration-300 ease-in-out",
        expanded ? 'md:ml-64' : 'md:ml-20'
      )}>
        <div className="w-full h-full flex flex-col items-center justify-center">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 