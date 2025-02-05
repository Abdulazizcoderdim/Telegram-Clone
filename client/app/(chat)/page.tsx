'use client';

import useAudio from '@/hooks/use-audio';
import { useAuth } from '@/hooks/use-auth';
import { useCurrentContact } from '@/hooks/use-current';
import { useLoading } from '@/hooks/use-loading';
import { toast } from '@/hooks/use-toast';
import { axiosClient } from '@/http/axios';
import { CONST } from '@/lib/constants';
import { generateToken } from '@/lib/generate-token';
import { emailSchema, messageSchema } from '@/lib/validation';
import { IError, IMessage, IUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const { playSound } = useAudio();

  const searchParams = useSearchParams();

  const CONTACT_ID = searchParams.get('chat');

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
      console.error(error);
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(data.messages);
      setContacts(prev =>
        prev.map(item =>
          item._id === currentContact?._id
            ? {
                ...item,
                lastMessage: item.lastMessage
                  ? { ...item.lastMessage, status: CONST.READ }
                  : null,
              }
            : item
        )
      );
    } catch {
      toast({ description: 'Cannot fetch messages', variant: 'destructive' });
    } finally {
      setLoadMessages(false);
    }
  };

  useEffect(() => {
    router.replace('/');
    socket.current = io('ws://localhost:5000', {});
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

          setContacts(prev => {
            return prev.map(contact => {
              if (contact._id === sender._id) {
                return {
                  ...contact,
                  lastMessage: {
                    ...newMessage,
                    status:
                      CONTACT_ID === sender._id
                        ? CONST.READ
                        : newMessage.status,
                  },
                };
              }
              return contact;
            });
          });
          // toast({
          //   title: 'New message',
          //   description: `You have a new message from ${receiver.email
          //     .split('@')[0]
          //     .toUpperCase()}`,
          // });
          if (!receiver.muted) {
            playSound(receiver.notificationSound);
          }
        }
      );

      socket.current?.on('getReadMessages', (messages: IMessage[]) => {
        setMessages(prev => {
          return prev.map(item => {
            const message = messages.find(msg => msg._id === item._id);
            return message ? { ...item, status: CONST.READ } : item;
          });
        });
      });
    }
  }, [session?.currentUser, socket, CONTACT_ID]);

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
      const { data } = await axiosClient.post<GetSocketType>(
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
      setContacts(prev =>
        prev.map(item =>
          item._id === currentContact?._id
            ? {
                ...item,
                lastMessage: { ...data.newMessage, status: CONST.READ },
              }
            : item
        )
      );
      messageForm.reset();
      socket.current?.emit('sendMessage', {
        newMessage: data.newMessage,
        receiver: data.receiver,
        sender: data.sender,
      });
    } catch {
      toast({ description: 'Cannot send message', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const onReadMessages = async () => {
    const receivedMessages = messages
      .filter(message => message.receiver._id === session?.currentUser?._id)
      .filter(message => message.status !== CONST.READ);

    if (receivedMessages.length === 0) return;
    const token = await generateToken(session?.currentUser?._id);
    try {
      const { data } = await axiosClient.post<{ messages: IMessage[] }>(
        '/api/user/message-read',
        { messages: receivedMessages },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.current?.emit('readMessages', {
        messages: data.messages,
        receiver: currentContact,
      });
      setMessages(prev => {
        return prev.map(item => {
          const message = data.messages.find(msg => msg._id === item._id);
          return message ? { ...item, status: CONST.READ } : item;
        });
      });
    } catch {
      toast({ description: 'Cannot read messages', variant: 'destructive' });
    }
  };

  const onReaction = async (reaction: string) => {
    
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
              onReadMessages={onReadMessages}
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
