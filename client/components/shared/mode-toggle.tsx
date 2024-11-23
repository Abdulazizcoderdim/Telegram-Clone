'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return resolvedTheme === 'dark' ? (
    <Button size={'lg'} variant={'ghost'} onClick={() => setTheme('light')}>
      <Sun />
    </Button>
  ) : (
    <Button size={'lg'} variant={'ghost'} onClick={() => setTheme('dark')}>
      <Moon />
    </Button>
  );
}
