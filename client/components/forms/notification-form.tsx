import { SOUNDS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ChevronDown, Ghost, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const NotificationForm = () => {
  const [selectedSound, setSelectedSound] = useState('');

  return (
    <>
      <div className="flex items-center justify-between relative">
        <div className="flex flex-col">
          <p className="font-spaceGrotesk">Notification Sound</p>
          <p className="font-spaceGrotesk text-muted-foreground text-xs">
            Apple
          </p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button size={'sm'}>
              Select <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 absolute -right-12">
            <div className="flex flex-col space-y-1">
              {SOUNDS.map(sound => (
                <div
                  key={sound.label}
                  className={cn(
                    'flex justify-between items-center bg-secondary cursor-pointer hover:bg-primary-foreground',
                    {
                      'bg-primary-foreground ': selectedSound === sound.value,
                    }
                  )}
                  onClick={() => setSelectedSound(sound.value)}
                >
                  <Button
                    size={'sm'}
                    variant={'ghost'}
                    className="justify-start"
                  >
                    {sound.label}
                  </Button>
                  {true ? (
                    <Button size={'icon'}>
                      <Ghost />
                    </Button>
                  ) : (
                    <Button size={'icon'} variant={'ghost'}>
                      <PlayCircle />
                    </Button>
                  )}
                </div>
              ))}
              <Button className="w-full mt-2 font-bold">Submit</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default NotificationForm;
