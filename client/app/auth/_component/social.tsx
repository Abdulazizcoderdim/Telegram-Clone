import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa6';

const Social = () => {
  return (
    <div className="grid grid-cols-2 w-full gap-1">
      <Button variant={'outline'}>
        <span>Sign up with Google</span>
        <FaGoogle />
      </Button>
      <Button variant={'outline'}>
        <span>Sign up with Google</span>
        <FaGithub />
      </Button>
    </div>
  );
};

export default Social;
