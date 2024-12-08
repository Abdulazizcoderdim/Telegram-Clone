'use client';

import { useCurrentContact } from '@/hooks/use-current';
import { emailSchema, messageSchema } from '@/lib/validation';
import { IUser } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AddContact from './_components/add-contact';
import Chat from './_components/chat';
import ContactList from './_components/contact-list';
import TopChat from './_components/top-chat';

const HomePage = () => {
  const { currentContact } = useCurrentContact();
  const router = useRouter();

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

  useEffect(() => {
    router.replace('/');
  }, []);

  const onCreateContact = (values: z.infer<typeof emailSchema>) => {
    // API call
    console.log(values);
  };

  const onSendMessage = (values: z.infer<typeof messageSchema>) => {
    // API call
    console.log(values);
  };

  return (
    <>
      <div className="w-80 h-screen border-r fixed inset-0 z-50">
        {/* Loading */}
        {/* <div className="w-full h-[95vh] flex justify-center items-center">
         <Loader2 size={50} className="animate-spin" />
        </div> */}

        {/* contact-list */}
        <ContactList contacts={contacts} />
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

const contacts: IUser[] = [
  {
    email: 'johndoeee@example.com',
    _id: '1',
    avatar: 'logo.png', // add avatar property
    firstName: 'John',
    lastName: 'Jane',
    bio: 'Hello world',
  },
  {
    email: 'jane@example.com',
    _id: '2',
    avatar: 'jane-avatar.jpg', // add avatar property
    firstName: 'Jane',
    lastName: 'Doe',
    bio: 'Hello world',
  },
  {
    email: 'ali@example.com',
    _id: '3',
    avatar: 'ali-avatar.jpg', // add avatar property
    firstName: 'Ali',
    lastName: 'Ahmed',
    bio: 'Hello world',
  },
  {
    email: 'bob@example.com',
    _id: '4',
    avatar: 'bob-avatar.jpg', // add avatar property
    firstName: 'Bob',
    lastName: 'Smith',
    bio: 'Hello world',
  },
];

export default HomePage;
