import { useCurrentContact } from '@/hooks/use-current';
import { CONST } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { IMessage } from '@/types';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
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
        <div className="right-1 bottom-0 opacity-60 absolute text-[9px] flex gap-[3px]">
          <p>{format(message.updatedAt, 'hh:mm')}</p>
          <div className="self-end">
            {message.receiver._id === currentContact?._id &&
              (message.status === CONST.READ ? (
                <CheckCheck size={12} />
              ) : (
                <Check size={12} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
