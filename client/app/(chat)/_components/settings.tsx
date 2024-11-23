import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Settings = () => {
  return (
    <Button size={'icon'} variant={'secondary'}>
      <Menu className="text-muted-foreground" />
    </Button>
  );
};

export default Settings;
