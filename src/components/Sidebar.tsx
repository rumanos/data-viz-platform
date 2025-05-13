import type { ReactNode } from 'react';
import {
  AlignJustify,
  Minimize2,
  User,
  MoreVertical,
  LogOutIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { useSidebarStore } from '../store/sidebarStore';

interface SidebarProps {
  children: ReactNode;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, mobileOpen, onMobileClose }) => {
  const expanded = useSidebarStore((state) => state.expanded);
  const toggleExpanded = useSidebarStore((state) => state.toggleExpanded);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <aside
      className={cn(
        'z-40 bg-background shadow-sm flex flex-col',
        mobileOpen 
          ? 'w-full h-full'
          : cn(
              'fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out',
              expanded ? 'w-64' : 'w-18',
              'hidden md:flex' 
            )
      )}
      role="complementary"
    >
      <nav className="h-full flex flex-col">
        <div className="p-4 pb-2 flex justify-between items-center">
          {
            !mobileOpen && <Button
              onClick={toggleExpanded}
              variant="ghost"
              size="icon"
              aria-label="Toggle sidebar"
              type="button"
              className="shrink-0"
            >
              {expanded ? <Minimize2 size={32} /> : <AlignJustify size={32} />}
            </Button>}
        </div>
        <ul className="flex-1 px-3">{children}</ul>
        <div className={cn("flex h-16 w-full relative", expanded ? "justify-start" : "justify-center")}>  
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full hover:bg-accent/20 hover:text-accent-foreground rounded-md">
              <div
                className={cn(
                  'flex cursor-pointer select-none p-3 items-center',
                  expanded ? 'w-52 ml-0' : 'justify-center'
                )}
                tabIndex={0}
                aria-haspopup="menu"
                aria-expanded={false}
              >
                <Avatar>
                  <AvatarImage
                    src={user?.photoURL || undefined}
                    alt={user?.displayName || user?.email || 'username'}
                  />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'flex items-center overflow-hidden transition-all',
                    expanded ? 'w-52 ml-3' : 'w-0'
                  )}
                >
                  <div
                    className={cn(
                      'flex flex-1 items-center justify-between w-full',
                      !expanded && 'hidden'
                    )}
                  >
                    <div className="leading-4 text-left">
                      <h4 className="font-semibold text-sm truncate">
                        {user?.displayName || 'username'}
                      </h4>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email || ''}
                      </span>
                    </div>
                    <MoreVertical size={18} className="ml-2" />
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={user?.photoURL || undefined}
                    alt={user?.displayName || user?.email || 'username'}
                  />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm truncate">{user?.displayName || 'username'}</span>
                  <span className="text-xs text-muted-foreground truncate">{user?.email || ''}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOutIcon className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
  const expanded = useSidebarStore((state) => state.expanded);
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
      <span className={cn('overflow-hidden', expanded ? 'w-auto ml-3' : 'w-0')}>{text}</span>
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