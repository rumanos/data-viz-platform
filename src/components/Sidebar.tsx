import type { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import {
  AlignJustify,
  Minimize2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '../store/sidebarStore';
import { UserProfile } from './UserProfile';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export interface SidebarMenuItem {
  key: string;
  label: string;
  icon: ReactNode;
  alert?: boolean;
  content: ReactNode;
}

interface SidebarProps {
  menuItems: SidebarMenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const storeExpanded = useSidebarStore((state) => state.expanded);
  const toggleExpanded = useSidebarStore((state) => state.toggleExpanded);
  const selectedMenuKey = useSidebarStore((state) => state.selectedMenuKey);
  const setSelectedMenuKey = useSidebarStore((state) => state.setSelectedMenuKey);
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); 
  const validMenuKeys = menuItems.map((item) => item.key); 
  // Determines the active menu item. If the stored selectedMenuKey is not valid
  // or not found in the current menuItems, it defaults to the key of the first
  // menuItem, or an empty string if menuItems is empty.
  const selectedMenu = validMenuKeys.includes(selectedMenuKey) ? selectedMenuKey : (menuItems[0]?.key || ''); 

  useEffect(() => { 
    // Handles window resize events to automatically close the mobile sidebar
    // if the screen width becomes large enough for the desktop sidebar layout.
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileSidebarOpen]);

  // Generates the sidebar's navigation content.
  // Adapts for mobile (full width, different toggle mechanism) or desktop (fixed width, expand/collapse).
  const sidebarContent = (isMobile: boolean) => (
    <nav className="h-full flex flex-col">
      <div className="p-4 pb-2 flex justify-between items-center">
        {
          !isMobile && <Button
            onClick={toggleExpanded}
            variant="ghost"
            size="icon"
            aria-label="Toggle sidebar"
            type="button"
            className="shrink-0"
          >
            {storeExpanded ? <Minimize2 size={32} /> : <AlignJustify size={32} />}
          </Button>}
      </div>
      <ul className="flex-1 px-3">
        {/* Use the menuItems prop */}
        {menuItems.map((item) => (
          <SidebarItem
            key={item.key}
            icon={item.icon}
            text={item.label}
            alert={item.alert}
            selected={selectedMenu === item.key}
            onClick={() => {
              setSelectedMenuKey(item.key);
              navigate(`/${item.key}`);
              if (isMobile) {
                setMobileSidebarOpen(false);
              }
            }}
            isEffectivelyExpanded={isMobile || storeExpanded} 
          />
        ))}
      </ul>
      <UserProfile isEffectivelyExpanded={isMobile || storeExpanded} />
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'z-40 bg-background shadow-sm flex flex-col', 
          cn(
            'fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out',
            storeExpanded ? 'w-64' : 'w-18',
            'hidden md:flex' 
          )
        )}
        role="complementary"
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile sidebar drawer */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed top-4 left-4 z-50 md:hidden flex items-center gap-2 px-3 py-2 bg-background hover:bg-accent"
            variant="secondary"
            aria-label="Open sidebar"
          >
            <AlignJustify className="w-6 h-6" />
            <span className="text-white font-medium text-base truncate max-w-[120px]">{menuItems.find((item) => item.key === selectedMenu)?.label}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 h-screen max-w-full left-0 top-0 rounded-none border-none shadow-xl md:hidden">
          {sidebarContent(true)}
        </SheetContent>
      </Sheet>
    </>
  );
};

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  alert?: boolean;
  selected?: boolean;
  onClick?: () => void;
  isEffectivelyExpanded?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, alert, selected, onClick, isEffectivelyExpanded }) => {
  const itemContent = (
    <li
      className={cn(
        'relative flex items-center py-2 px-3 my-1 font-medium rounded-[10px] border border-transparent cursor-pointer transition-colors group',
        selected
          ? 'bg-[#242424] border-border shadow-sm'
          : 'hover:text-white text-muted-foreground'
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-current={selected ? 'page' : undefined}
    >
      {icon}
      <span className={cn('overflow-hidden transition-all duration-300 ease-in-out', isEffectivelyExpanded ? 'w-auto ml-3' : 'w-0 opacity-0')}>{text}</span>
      {alert && (
        <div className={cn('absolute right-2 w-2 h-2 rounded bg-primary', isEffectivelyExpanded ? '' : 'top-2')} />
      )}
    </li>
  );

  if (!isEffectivelyExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {text}
        </TooltipContent>
      </Tooltip>
    );
  }

  return itemContent;
}; 