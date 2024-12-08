import { ModeToggle } from '@/components/shared/mode-toggle';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { messageSchema } from '@/lib/validation';
import emojies from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Paperclip, Send, Smile } from 'lucide-react';
import { useTheme } from 'next-themes';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  onSendMessage: (values: z.infer<typeof messageSchema>) => void;
  messageForm: UseFormReturn<z.infer<typeof messageSchema>>;
}

const Chat: React.FC<Props> = ({ onSendMessage, messageForm }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col justify-end z-40 min-h-[92vh]">
      {/* Loading */}
      {/* <ChatLoading /> */}
      {/* Messages */}
      {/* <MessageCard isReceived /> */}

      {/* Start conversation */}
      {/* <div className="w-full h-[88vh] flex items-center justify-center">
        <div
          onClick={() => onSendMessage({ text: '👋' })}
          className="text-[100px] cursor-pointer select-none"
        >
          👋
        </div>
      </div> */}

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
              <Picker data={emojies} theme={resolvedTheme} />
            </PopoverContent>
          </Popover>

          <Button className="rounded-none" type="submit" size={'icon'}>
            <Send />
          </Button>

          <ModeToggle />
        </form>
      </Form>
    </div>
  );
};

export default Chat;
