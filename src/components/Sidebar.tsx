import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ChevronFirst,
  ChevronLast,
  MoreVertical,
  User,
  Snail,
} from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { cn } from '@/lib/utils';

interface SidebarContextProps {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextProps>({ expanded: true });

interface SidebarProps {
  children: ReactNode;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, mobileOpen, onMobileClose }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={cn(
        'h-screen z-40',
        mobileOpen ? 'fixed top-0 left-0 w-64 md:static md:w-auto' : 'md:static'
      )}
      role="complementary"
    >
      <nav className="h-full flex flex-col bg-background shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <Snail
            className={cn(
              'text-primary transition-all',
              expanded ? 'w-6 h-6' : 'w-0 h-8'
            )}
          />
          <Button
            onClick={() => setExpanded((curr) => !curr)}
            variant="ghost"
            size="icon"
            aria-label="Toggle sidebar"
            type="button"
            className="shrink-0"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </Button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
        <div className="border-t flex p-3 items-center">
          <User className="w-10 h-10 rounded-md text-primary bg-primary/10 p-2" />
          <div
            className={cn(
              'flex justify-between items-center overflow-hidden transition-all',
              expanded ? 'w-52 ml-3' : 'w-0'
            )}
          >
            <div className="leading-4">
              <h4 className="font-semibold">username</h4>
              <span className="text-xs text-muted-foreground">m@example.com</span>
            </div>
            <MoreVertical size={18} />
          </div>
        </div>
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  alert?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, alert, selected, onClick }) => {
  const { expanded } = useContext(SidebarContext);
  const itemContent = (
    <li
      className={cn(
        'relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group',
        selected
          ? 'bg-gradient-to-tr from-primary/20 to-primary/10 text-primary'
          : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-current={selected ? 'page' : undefined}
    >
      {icon}
      <span className={cn('overflow-hidden transition-all', expanded ? 'w-52 ml-3' : 'w-0')}>{text}</span>
      {alert && (
        <div className={cn('absolute right-2 w-2 h-2 rounded bg-primary', expanded ? '' : 'top-2')} />
      )}
    </li>
  );

  if (!expanded) {
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