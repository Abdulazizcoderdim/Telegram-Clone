'use client';

import { useCurrentContact } from '@/hooks/use-current';
import { useLoading } from '@/hooks/use-loading';
import { toast } from '@/hooks/use-toast';
import { axiosClient } from '@/http/axios';
import { generateToken } from '@/lib/generate-token';
import { emailSchema, messageSchema } from '@/lib/validation';
import { IError, IUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AddContact from './_components/add-contact';
import Chat from './_components/chat';
import ContactList from './_components/contact-list';
import TopChat from './_components/top-chat';

const HomePage = () => {
  const [contacts, setContacts] = useState<IUser[]>([]);
  const { setCreating, setLoading, isLoading } = useLoading();
  const { currentContact } = useCurrentContact();
  const router = useRouter();
  const { data: session } = useSession();

  const contactForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const messageForm = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      text: '',
      image: '',
    },
  });

  const getContacts = async () => {
    setLoading(true);
    const token = await generateToken(session?.currentUser?._id);
    console.log(token);
    try {
      const { data } = await axiosClient.get<{ contacts: IUser[] }>(
        '/api/user/contacts',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContacts(data.contacts);
    } catch (error) {
      toast({ description: 'Cannot fetch contacts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    router.replace('/');
  }, []);

  useEffect(() => {
    if (session?.currentUser?._id) getContacts();
  }, [session?.currentUser]);

  const onCreateContact = async (values: z.infer<typeof emailSchema>) => {
    setCreating(true);
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.post<{ contact: IUser }>(
        '/api/user/contact',
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContacts(prev => [...prev, data.contact]);
      toast({
        description: 'Contact created successfully',
      });
      contactForm.reset();
    } catch (error) {
      if ((error as IError).response?.data?.message) {
        return toast({
          description: (error as IError).response.data.message,
          variant: 'destructive',
        });
      }
      return toast({
        description: 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const onSendMessage = (values: z.infer<typeof messageSchema>) => {
    // API call
    console.log(values);
  };

  return (
    <>
      <div className="w-80 h-screen border-r fixed inset-0 z-50">
        {/* Loading */}
        {isLoading && (
          <div className="w-full h-[95vh] flex justify-center items-center">
            <Loader2 size={50} className="animate-spin" />
          </div>
        )}

        {/* contact-list */}
        {!isLoading && <ContactList contacts={contacts} />}
      </div>

      {/* chat area */}
      <div className="pl-80 w-full">
        {/* add contact */}
        {!currentContact?._id && (
          <AddContact
            contactForm={contactForm}
            onCreateContact={onCreateContact}
          />
        )}

        {/* chat */}
        {currentContact?._id && (
          <div className="w-full relative">
            {/* top chat */}
            <TopChat />
            {/* chat messages */}
            <Chat messageForm={messageForm} onSendMessage={onSendMessage} />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
