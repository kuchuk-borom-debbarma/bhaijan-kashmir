'use client';

import { User, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { signOutAction } from '@/app/auth/actions';

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-walnut hover:text-kashmir-red transition-colors focus:outline-none"
      >
        <User className="w-4 h-4" />
        <span className="hidden md:inline">Hi, {user.name?.split(' ')[0]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-stone-200 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2 border-b border-stone-100">
            <p className="text-sm font-medium text-walnut truncate">{user.name}</p>
            <p className="text-xs text-stone-500 truncate">{user.email}</p>
          </div>
          
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-walnut hover:bg-stone-50 hover:text-kashmir-red transition-colors"
          >
            <UserCircle className="w-4 h-4" />
            Profile
          </Link>

          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-walnut hover:bg-stone-50 hover:text-kashmir-red transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
