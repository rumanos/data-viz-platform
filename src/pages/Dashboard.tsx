import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/ui/loader';
import { Sidebar, type SidebarMenuItem } from '../components/Sidebar';
import { useSidebarStore } from '../store/sidebarStore';
import { useAuthStore } from '../store/authStore';
import { cn } from '@/lib/utils';
import { Home, Bell, ClipboardList, CloudUpload, Settings } from 'lucide-react';
import { PlaceholderView } from '@/components/views/PlaceholderView';
import { HomeView } from '@/components/views/HomeView';
const iconMap = {
  Home,
  Bell,
  ClipboardList,
  CloudUpload,
  Settings,
};

const menuItemConfigurations: MenuItemConfig[] = [
  { key: 'home', iconName: 'Home', content: <HomeView /> },
  { key: 'notifications', iconName: 'Bell' },
  { key: 'tasks', iconName: 'ClipboardList' },
  { key: 'upload', iconName: 'CloudUpload' },
  { key: 'settings', iconName: 'Settings' },
];

type IconKey = keyof typeof iconMap;

interface MenuItemConfig {
  key: string;
  label?: string;
  iconName: IconKey;
  content?: React.ReactNode;
  alert?: boolean;
}

// Transforms a MenuItemConfig into a SidebarMenuItem, suitable for the Sidebar component.
// It dynamically loads the specified Lucide icon and provides a default PlaceholderView
// if no explicit content component is defined in the configuration.
function createDashboardMenuItem(config: MenuItemConfig): SidebarMenuItem {
  const IconComponent = iconMap[config.iconName];
  if (!IconComponent) {
    // This check is mainly for runtime robustness if configs were from an external source.
    // With IconKey type, TypeScript should catch mismatches during development.
    console.error(`Icon component not found for name: ${config.iconName}`);
    throw new Error(`Icon component not found for name: ${config.iconName}`);
  }
  const itemLabel = config.label || config.key.charAt(0).toUpperCase() + config.key.slice(1);

  return {
    key: config.key,
    label: itemLabel,
    icon: <IconComponent size={20} />,
    alert: config.alert,
    content: config.content === undefined
      ? <PlaceholderView label={itemLabel} icon={<IconComponent size={48} className="stroke-1" />} />
      : config.content,
  };
}

const dashboardMenuItems: SidebarMenuItem[] = menuItemConfigurations.map(createDashboardMenuItem);

const Dashboard: React.FC = () => {
  const { user, loading } = useAuthStore();
  const expanded = useSidebarStore((state) => state.expanded);
  const selectedMenuKey = useSidebarStore((state) => state.selectedMenuKey);
  const setSelectedMenuKey = useSidebarStore((state) => state.setSelectedMenuKey);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirects to the login page if the user is not authenticated and loading is complete.
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Ensures a valid menu item is selected and navigates to its corresponding route.
    // If no menu key is selected or the selected key is invalid (e.g., after login or on initial load),
    // it defaults to the first item in `dashboardMenuItems` or 'home'.
    if (user) {
      const validMenuKeys = dashboardMenuItems.map((item: SidebarMenuItem) => item.key);
      if (!selectedMenuKey || !validMenuKeys.includes(selectedMenuKey)) {
        const defaultKey = dashboardMenuItems[0]?.key || 'home';
        setSelectedMenuKey(defaultKey);
        navigate(`/${defaultKey}`, { replace: true });
      }
    }
  }, [user, selectedMenuKey, setSelectedMenuKey, navigate]);

  if (loading) {
    return <Loader />;
  }

  // Renders the content for the currently selected menu item.
  // Finds the corresponding item in `dashboardMenuItems` and displays its content.
  // If no item is found (which shouldn't happen with the defaulting logic above),
  // it displays a "Page not found" message.
  const renderContent = () => {
    const selectedItem = dashboardMenuItems.find(item => item.key === selectedMenuKey);
    return selectedItem ? selectedItem.content : <div className="p-6">Page not found</div>;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar menuItems={dashboardMenuItems} />
      <main className={cn(
        "flex-1 flex flex-col items-center justify-center w-full min-h-screen transition-all duration-300 ease-in-out",
        expanded ? 'md:ml-64' : 'md:ml-18'
      )}>
        <div className="w-full h-full flex flex-col items-center justify-center">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 