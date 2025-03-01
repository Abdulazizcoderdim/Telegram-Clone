import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { axiosClient } from '@/http/axios';
import { otpSchema } from '@/lib/validation';
import { IUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Verify = () => {
  const { email } = useAuth();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email,
      otp: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (otp: string) => {
      const { data } = await axiosClient.post<{ user: IUser }>(
        '/api/auth/verify',
        { email, otp }
      );
      return data;
    },
    onSuccess: ({ user }) => {
      signIn('credentials', { email: user.email, callbackUrl: '/' });
      toast({ description: 'You have successfully verified your account.' });
    },
  });

  function onSubmit(values: z.infer<typeof otpSchema>) {
    mutate(values.otp);
  }

  return (
    <div className="w-full">
      <p className="text-center text-muted-foreground text-sm">
        We have sent you an email with a verification code to your email
        address.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input
                    disabled
                    placeholder="example@gmail.com"
                    className="h-10 bg-secondary"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <Label>One-Time Password</Label>
                <FormControl>
                  <InputOTP
                    disabled={isPending}
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
            disabled={isPending}
            className="w-full"
            size={'lg'}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Verify;
