import React from 'react';
import {
  User,
  MoreVertical,
  LogOutIcon,
} from 'lucide-react';
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

interface UserProfileProps {
  isEffectivelyExpanded?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ isEffectivelyExpanded }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className={cn("flex h-16 w-full relative", isEffectivelyExpanded ? "justify-start" : "justify-center")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-full hover:bg-accent/20 hover:text-accent-foreground rounded-md">
          <div
            className={cn(
              'flex cursor-pointer select-none p-3 items-center',
              isEffectivelyExpanded ? 'w-52 ml-0' : 'justify-center'
            )}
            tabIndex={0}
            aria-haspopup="menu"
            aria-expanded={false}
          >
            <Avatar>
              <AvatarImage
                src={user.photoURL || undefined}
                alt={user.displayName || user.email || 'username'}
              />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                'flex items-center overflow-hidden transition-all',
                isEffectivelyExpanded ? 'w-52 ml-3' : 'w-0'
              )}
            >
              <div
                className={cn(
                  'flex flex-1 items-center justify-between w-full',
                  !isEffectivelyExpanded && 'hidden'
                )}
              >
                <div className="leading-4 text-left">
                  <h4 className="font-semibold text-sm truncate">
                    {user.displayName || 'username'}
                  </h4>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email || ''}
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
                src={user.photoURL || undefined}
                alt={user.displayName || user.email || 'username'}
              />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm truncate">{user.displayName || 'username'}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email || ''}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive flex items-center gap-2 cursor-pointer">
            <LogOutIcon className="w-4 h-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 