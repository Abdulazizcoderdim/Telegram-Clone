export interface ChildProps {
  children: React.ReactNode;
}

export interface IError {
  response: { data: { message: string } };
}

export interface IUser {
  _id: string;
  email: string;
  avatar: string;
  firstName: string;
  lastName: string;
  bio: string;
}
