import { ChevronDown } from "lucide-react";
import { Popover, PopoverTrigger } from "../ui/popover";

const NotificationForm = () => {
  return ( 
    <>
      <div className='flex items-center justify-between relative'>
        <div className='flex flex-col'>
					<p className='font-spaceGrotesk'>Notification Sound</p>
					<p className='font-spaceGrotesk text-muted-foreground text-xs'>
            Apple
          </p>
				</div>

        <Popover>
          <PopoverTrigger asChild>
            <Button>
              Select <ChevronDown/>
            </Button>
            </PopoverTrigger>
        </Popover>
      </div>
    </>
  )
};

export default NotificationForm;
