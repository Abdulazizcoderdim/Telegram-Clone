import { IUser } from '@/types';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    currentUser?: IUser;
    user: {} & DefaultSession['user'];
  }
}
