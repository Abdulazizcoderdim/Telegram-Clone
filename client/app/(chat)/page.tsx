import { IUser } from '@/types';
import ContactList from './_components/contact-list';

const HomePage = () => {
  return (
    <div className="w-80 h-screen border-r fixed inset-0 z-50">
      {/* Loading */}
      {/* <div className="w-full h-[95vh] flex justify-center items-center">
        <Loader2 size={50} className="animate-spin" />
      </div> */}

      {/* contact-list */}
      <ContactList contacts={contacts} />
    </div>
  );
};

const contacts: IUser[] = [
  {
    email: 'johnjanejohnjanjeohnjanejohnjanejohnjanjeohnjane@example.com',
    _id: '1',
    avatar: 'logo.png', // add avatar property
  },
  {
    email: 'jane@example.com',
    _id: '2',
    avatar: 'jane-avatar.jpg', // add avatar property
  },
  {
    email: 'ali@example.com',
    _id: '3',
    avatar: 'ali-avatar.jpg', // add avatar property
  },
  {
    email: 'bob@example.com',
    _id: '4',
    avatar: 'bob-avatar.jpg', // add avatar property
  },
];
export default HomePage;
