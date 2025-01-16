import { useCurrentContact } from '@/hooks/use-current';
import { cn } from '@/lib/utils';
import { IMessage } from '@/types';
import { FC } from 'react';

interface Props {
  message: IMessage;
}

const MessageCard: FC<Props> = ({ message }) => {
  const { currentContact } = useCurrentContact();

  console.log(currentContact);

  return (
    <div
      className={cn(
        'm-2.5 font-medium text-xs flex',
        message.receiver._id === currentContact?._id
          ? 'justify-start'
          : 'justify-end'
      )}
    >
      <div
        className={cn(
          'relative dark:text-white text-black rounded-md inline p-2 pl-2.5 max-w-full pr-12',
          message.receiver._id === currentContact?._id
            ? 'bg-primary text-white'
            : 'bg-secondary'
        )}
      >
        <p className="text-sm">{message.text}</p>
        <span className="absolute text-xs right-1 bottom-0 opacity-60">✔</span>
      </div>
    </div>
  );
};

export default MessageCard;
