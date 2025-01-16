'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCurrentContact } from '@/hooks/use-current';
import { useLoading } from '@/hooks/use-loading';
import { toast } from '@/hooks/use-toast';
import { axiosClient } from '@/http/axios';
import { generateToken } from '@/lib/generate-token';
import { emailSchema, messageSchema } from '@/lib/validation';
import { IError, IMessage, IUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { io } from 'socket.io-client';
import { z } from 'zod';
import AddContact from './_components/add-contact';
import Chat from './_components/chat';
import ContactList from './_components/contact-list';
import TopChat from './_components/top-chat';

const HomePage = () => {
  const [contacts, setContacts] = useState<IUser[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { setCreating, setLoading, isLoading, setLoadMessages } = useLoading();
  const { currentContact } = useCurrentContact();
  const router = useRouter();
  const { data: session } = useSession();
  const { setOnlineUsers } = useAuth();

  const socket = useRef<ReturnType<typeof io> | null>(null);

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

  const getMessages = async () => {
    setLoadMessages(true);
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.get<{ messages: IMessage[] }>(
        `/api/user/messages/${currentContact?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(data?.messages);
    } catch {
      toast({ description: 'Cannot fetch messages', variant: 'destructive' });
    } finally {
      setLoadMessages(false);
    }
  };

  useEffect(() => {
    router.replace('/');
    socket.current = io('ws://localhost:5000', {});
    console.log('Socket connected');
  }, []);

  useEffect(() => {
    if (session?.currentUser?._id) {
      socket.current?.emit('addOnlineUser', session?.currentUser);
      socket.current?.on(
        'getOnlineUsers',
        (data: { socketId: string; user: IUser }[]) => {
          setOnlineUsers(data.map(item => item.user));
        }
      );
      getContacts();
    }
  }, [session?.currentUser]);

  useEffect(() => {
    if (session?.currentUser) {
      socket.current?.on('getCreatedUser', user => {
        setContacts(prev => {
          const isExist = prev.some(item => item._id === user._id);
          return isExist ? prev : [...prev, user];
        });
      });

      socket.current?.on(
        'getNewMessage',
        ({ newMessage, receiver, sender }: GetSocketType) => {
          setMessages(prev => {
            const isExist = prev.some(item => item._id === newMessage._id);
            return isExist ? prev : [...prev, newMessage];
          });
          toast({
            title: 'New message',
            description: `You have a new message from ${receiver.email
              .split('@')[0]
              .toUpperCase()}`,
          });
        }
      );
    }
  }, [session?.currentUser, socket]);

  useEffect(() => {
    if (currentContact?._id) {
      getMessages();
    }
  }, [currentContact]);

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
      socket.current?.emit('createContact', {
        currentUser: session?.currentUser,
        receiver: data.contact,
      });
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

  const onSendMessage = async (values: z.infer<typeof messageSchema>) => {
    setCreating(true);
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.post<{ newMessage: IMessage }>(
        '/api/user/message',
        {
          ...values,
          receiver: currentContact?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(prev => [...prev, data.newMessage]);
      messageForm.reset();
      socket.current?.emit('sendMessage', {
        newMessage: data.newMessage,
        receiver: currentContact,
        sender: session?.currentUser,
      });
    } catch {
      toast({ description: 'Cannot send message', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
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
            <Chat
              messages={messages}
              messageForm={messageForm}
              onSendMessage={onSendMessage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;

interface GetSocketType {
  receiver: IUser;
  sender: IUser;
  newMessage: IMessage;
}
