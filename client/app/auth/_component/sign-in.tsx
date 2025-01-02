import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { axiosClient } from '@/http/axios';
import { emailSchema } from '@/lib/validation';
import { IError } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SignIn = () => {
  const { setEmail, setStep } = useAuth();
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const { data } = await axiosClient.post<{ email: string }>(
        '/api/auth/login',
        { email }
      );
      return data;
    },
    onSuccess: res => {
      setEmail(res.email);
      setStep('verify');
      toast({
        description:
          'We have sent you an email with a verification code to your email address.',
      });
    },
    onError: (error: IError) => {
      if (error.response?.data?.message) {
        return toast({
          description: error.response.data.message,
          variant: 'destructive',
        });
      }
      return toast({
        description: 'Something went wrong, please try again.',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: z.infer<typeof emailSchema>) {
    mutate(values.email);
  }
  
  return (
    <div className="w-full">
      <p className="text-center text-muted-foreground text-sm">
        Telegram is a messaging app with a focus on speed and security,
        it&apos;s super-fast, simple and free.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input
                    disabled={isPending}
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
            disabled={isPending}
            type="submit"
            className="w-full"
            size={'lg'}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignIn;
