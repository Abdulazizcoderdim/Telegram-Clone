import MessageCard from '@/components/cards/message-card';
import ChatLoading from '@/components/loadings/chat.loading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLoading } from '@/hooks/use-loading';
import { messageSchema } from '@/lib/validation';
import { IMessage } from '@/types';
import emojies from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Paperclip, Send, Smile } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  onSendMessage: (values: z.infer<typeof messageSchema>) => Promise<void>;
  messageForm: UseFormReturn<z.infer<typeof messageSchema>>;
  messages: IMessage[];
  onReadMessages: () => Promise<void>;
}

const Chat: React.FC<Props> = ({
  onSendMessage,
  onReadMessages,
  messageForm,
  messages,
}) => {
  const { loadMessages } = useLoading();
  const { resolvedTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    onReadMessages();
  }, [messages]);

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current;

    if (!input) return;

    const text = messageForm.getValues('text');
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    const newText = text.slice(0, start) + emoji + text.slice(end);

    messageForm.setValue('text', newText);

    setTimeout(() => {
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  return (
    <div className="flex flex-col justify-end z-40 min-h-[92vh]">
      {/* Loading */}
      {loadMessages && <ChatLoading />}
      {/* Messages */}
      {messages.map((message, index) => (
        <MessageCard key={index} message={message} />
      ))}

      {/* Start conversation */}
      {messages.length === 0 && (
        <div className="w-full h-[88vh] flex items-center justify-center">
          <div
            onClick={() => onSendMessage({ text: '👋' })}
            className="text-[100px] cursor-pointer select-none"
          >
            👋
          </div>
        </div>
      )}

      {/* Input */}
      <Form {...messageForm}>
        <form
          onSubmit={messageForm.handleSubmit(onSendMessage)}
          className="w-full flex relative"
        >
          <Button
            size={'icon'}
            type="button"
            className="rounded-none"
            variant={'secondary'}
          >
            <Paperclip />
          </Button>
          <FormField
            control={messageForm.control}
            name={'text'}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    ref={inputRef}
                    placeholder="Type a message"
                    className="h-9 rounded-none border-l border-l-foreground border-r border-r-muted-foreground resize-none  bg-secondary"
                    value={field.value}
                    onBlur={() => field.onBlur()}
                    onChange={e => field.onChange(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="rounded-none"
                type="button"
                variant={'secondary'}
                size={'icon'}
              >
                <Smile />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none rounded-md absolute right-6 bottom-0">
              <Picker
                onEmojiSelect={(emoji: { native: string }) =>
                  handleEmojiSelect(emoji.native)
                }
                data={emojies}
                theme={resolvedTheme}
              />
            </PopoverContent>
          </Popover>

          <Button className="rounded-none" type="submit" size={'icon'}>
            <Send />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Chat;
