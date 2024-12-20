import { oldEmailSchema, otpSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
import { Label } from '../ui/label';


const EmailForm = () => {
  const [verify, setVerify] = useState(false);

  
  const emailForm = useForm<z.infer<typeof oldEmailSchema>>({
    resolver: zodResolver(oldEmailSchema),
    defaultValues: {
      email: '',
      oldEmail: 'info@exmaple.com',
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  function onEmailSubmit(values: z.infer<typeof oldEmailSchema>) {
    console.log(values);
    otpForm.setValue('email', values.email);
    setVerify(true);
  }

  function onVerifySubmit(values: z.infer<typeof otpSchema>) {
    console.log(values);
  }

  return !verify ? (
    <Form {...emailForm}>
      <form
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        className="space-y-2"
      >
        <FormField
          control={emailForm.control}
          name="oldEmail"
          render={({ field }) => (
            <FormItem>
              <Label>Current email</Label>
              <FormControl>
                <Input className="h-10 bg-secondary" disabled {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={emailForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>Enter a new email</Label>
              <FormControl>
                <Input
                  placeholder="example@gmail.com"
                  className="h-10 bg-secondary"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Verify email
        </Button>
      </form>
    </Form>
  ) : (
    <Form {...otpForm}>
      <form onSubmit={otpForm.handleSubmit(onVerifySubmit)} className='space-y-2'>
        <Label>New email</Label>
        <Input className='h-10 bg-secondary' disabled value={emailForm.watch('email')}/>
        
        <FormField
            control={otpForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <Label>One-Time Password</Label>
                <FormControl>
                  <InputOTP
                    pattern={REGEXP_ONLY_DIGITS}
                    maxLength={6}
                    {...field}
                    className="w-full"
                  >
                    <InputOTPGroup className="w-full">
                      <InputOTPSlot
                        className="w-full h-10 text-xl dark:bg-primary-foreground bg-secondary"
                        index={0}
                      />
                      <InputOTPSlot
                        className="w-full h-10 text-xl dark:bg-primary-foreground bg-secondary"
                        index={1}
                      />
                      <InputOTPSlot
                        className="w-full h-10 text-xl dark:bg-primary-foreground bg-secondary"
                        index={2}
                      />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup className="w-full">
                      <InputOTPSlot
                        className="w-full h-10 text-xl dark:bg-primary-foreground bg-secondary"
                        index={3}
                      />
                      <InputOTPSlot
                        className="w-full h-10 text-xl dark:bg-primary-foreground bg-secondary"
                        index={4}
                      />
                      <InputOTPSlot
                        className="w-full h-10 text-xl dark:bg-primary-foreground bg-secondary"
                        index={5}
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <Button className='w-full' type='submit'>
            Submit
          </Button>
      </form>
    </Form>
  )
};

export default EmailForm;
