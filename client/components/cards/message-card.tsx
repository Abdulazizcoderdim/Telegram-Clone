import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useCurrentContact } from '@/hooks/use-current';
import { CONST } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { IMessage } from '@/types';
import { format } from 'date-fns';
import { Check, CheckCheck, Edit2, Trash } from 'lucide-react';
import { FC } from 'react';

interface Props {
  message: IMessage;
}

const MessageCard: FC<Props> = ({ message }) => {
  const { currentContact } = useCurrentContact();

  const reactions = ['👍', '👎', '😂', '😱', '😭', '😡'];

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
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
            <p className="text-sm font-sans">{message.text}</p>
            <div className="right-1 bottom-0 opacity-60 absolute text-[9px] flex gap-[3px]">
              <p className="font-sans">{format(message.updatedAt, 'hh:mm')}</p>
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
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56 p-0 mb-10">
        <ContextMenuItem className="grid grid-cols-6">
          {reactions.map((reaction, index) => (
            <div
              className={cn(
                'text-xl cursor-pointer p-1 hover:bg-primary/50 rounded-md transition-all',
                message.reaction === reaction && 'bg-primary/50'
              )}
              key={index}
            >
              {reaction}
            </div>
          ))}
        </ContextMenuItem>
        {message.sender._id !== currentContact?._id && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem className="cursor-pointer">
              <Edit2 size={14} className="mr-2" />
              <span>Edit</span>
            </ContextMenuItem>
            <ContextMenuItem className="cursor-pointer">
              <Trash size={14} className="mr-2" />
              <span>Delete</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageCard;
