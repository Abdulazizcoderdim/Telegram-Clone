import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentContact } from '@/hooks/use-current';
import { Settings2 } from 'lucide-react';

const TopChat = () => {
  const { currentContact } = useCurrentContact();

  return (
    <div className="w-full flex items-center justify-between sticky top-0 z-50 h-[8vh] p-2 border-b bg-background">
      <div className="flex items-center">
        <Avatar className="z-40">
          <AvatarImage
            src={currentContact?.avatar}
            alt={currentContact?.email}
            className="object-cover"
          />
          <AvatarFallback className="uppercase">
            {currentContact?.email[0]}
          </AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <h2 className="font-medium text-sm">{currentContact?.email}</h2>
          {/* is typing */}
          {/* <div className="text-xs flex items-center gap-1 text-muted-foreground">
            <p className="text-secondary-foreground animate-pulse line-clamp-1">
              Hello world
            </p>
            <div className="self-end mb-1">
              <div className="flex justify-center items-center gap-1">
                <div className="w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                <div className="w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:0.6s]" />
              </div>
            </div>
          </div> */}
          <p className="text-xs">
            {/* Online */}
            {/* <span className="text-green-500 mr-1">●</span>Online */}
            {/* Offline */}
            <span className="text-red-500 mr-1">●</span>Last seen recently
          </p>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button size={'icon'} variant={'secondary'}>
            <Settings2 />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle />
          </SheetHeader>
          <div className="mx-auto w-1/2 h-36 relative">
            <Avatar className="w-full h-36">
              <AvatarImage
                src={currentContact?.avatar}
                alt={currentContact?.email}
                className="object-cover"
              />
              <AvatarFallback className="text-6xl font-spaceGrotesk uppercase">
                {currentContact?.email[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TopChat;
