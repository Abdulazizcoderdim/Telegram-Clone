import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { messageSchema } from '@/lib/validation';
import { Paperclip, Send, Smile } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  onSendMessage: (values: z.infer<typeof messageSchema>) => void;
  messageForm: UseFormReturn<z.infer<typeof messageSchema>>;
}

const Chat: React.FC<Props> = ({ onSendMessage, messageForm }) => {
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
          <Button
            className="rounded-none"
            type="button"
            variant={'secondary'}
            size={'icon'}
          >
            <Smile />
          </Button>
          <Button className="rounded-none" type="submit" size={'icon'}>
            <Send />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Chat;
