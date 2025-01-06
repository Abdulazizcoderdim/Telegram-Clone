import { toast } from '@/hooks/use-toast';
import { axiosClient } from '@/http/axios';
import { generateToken } from '@/lib/generate-token';
import { oldEmailSchema, otpSchema } from '@/lib/validation';
import { IError } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { signOut, useSession } from 'next-auth/react';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../ui/input-otp';
import { Label } from '../ui/label';

const EmailForm = () => {
  const { data: session } = useSession();
  const [verify, setVerify] = useState(false);

  const emailForm = useForm<z.infer<typeof oldEmailSchema>>({
    resolver: zodResolver(oldEmailSchema),
    defaultValues: {
      email: '',
      oldEmail: session?.currentUser?.email || '',
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  const otpMutation = useMutation({
    mutationFn: async (email: string) => {
      const token = await generateToken(session?.currentUser?._id);
      const { data } = await axiosClient.post<{ email: string }>(
        '/api/user/send-otp',
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    },
    onSuccess: ({ email }) => {
      toast({ description: 'OTP sent to your email' });
      otpForm.setValue('email', email);
      setVerify(true);
    },
    onError: (error: IError) => {
      if (error.response?.data?.message)
        return toast({
          description: error.response.data.message,
          variant: 'destructive',
        });

      toast({ description: 'Something went wrong, please try again' });
    },
  });

  function onEmailSubmit(values: z.infer<typeof oldEmailSchema>) {
    otpMutation.mutate(values.email);
  }

  const verifyMutation = useMutation({
    mutationFn: async (otp: string) => {
      const token = await generateToken(session?.currentUser?._id);
      const { data } = await axiosClient.put<{ email: string; otp: string }>(
        '/api/user/email',
        { email: otpForm.getValues('email'), otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      signOut();
      toast({ description: 'Email updated successfully' });
    },
  });

  function onVerifySubmit(values: z.infer<typeof otpSchema>) {
    verifyMutation.mutate(values.otp);
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
                  disabled={otpMutation.isPending}
                  placeholder="example@gmail.com"
                  className="h-10 bg-secondary"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <Button
          disabled={otpMutation.isPending}
          type="submit"
          className="w-full"
        >
          Verify email
        </Button>
      </form>
    </Form>
  ) : (
    <Form {...otpForm}>
      <form
        onSubmit={otpForm.handleSubmit(onVerifySubmit)}
        className="space-y-2"
      >
        <Label>New email</Label>
        <Input
          className="h-10 bg-secondary"
          disabled
          value={emailForm.watch('email')}
        />

        <FormField
          control={otpForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <Label>One-Time Password</Label>
              <FormControl>
                <InputOTP
                  disabled={verifyMutation.isPending}
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
        <Button
          disabled={verifyMutation.isPending}
          className="w-full"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default EmailForm;
