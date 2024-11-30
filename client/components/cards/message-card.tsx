import { cn } from '@/lib/utils';
import { FC } from 'react';

interface Props {
  isReceived?: boolean;
}

const MessageCard: FC<Props> = ({ isReceived }) => {
  return (
    <div
      className={cn(
        'm-2.5 font-medium text-xs flex',
        isReceived ? 'justify-start' : 'justify-end'
      )}
    >
      <div
        className={cn(
          'relative rounded-md inline p-2 pl-2.5 max-w-full pr-12',
          isReceived ? 'bg-primary' : 'bg-secondary'
        )}
      >
        <p className="text-sm text-white">Hello world</p>
        <span className="absolute text-xs right-1 bottom-0 opacity-60">✔</span>
      </div>
    </div>
  );
};

export default MessageCard;
