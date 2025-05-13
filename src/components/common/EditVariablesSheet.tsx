import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { XIcon } from "lucide-react";
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface EditVariablesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditVariablesSheet: React.FC<EditVariablesSheetProps> = ({ open, onOpenChange }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-full sm:max-w-xl sm:w-3/4 xl:max-w-xl xl:w-[36rem] p-[18px] [&_[data-slot=sheet-close]]:hidden"
      >
        <SheetHeader className="relative flex items-end justify-between flex-row text-[18px] md:text-[24px] font-semibold">
          <SheetTitle>Edit Variables</SheetTitle>
           <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-10 w-10 rounded-full cursor-pointer bg-transparent border-none hover:bg-transparent"
          >
            <XIcon className="size-5" />
          </Button>
          
        </SheetHeader>
        {/* TODO: Add form or variable editing UI here */}
        <div className="flex-1 px-4">
          {/* add a form with a sticky header that has search bar autofill and rerun button */}
          <div className="sticky top-0 z-10 bg-background p-0">
            <div className="flex flex-row gap-4">
              <Input />
              <Button>Autofill</Button>
              <Button>Rerun</Button>
            </div>
          </div>
          
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditVariablesSheet; 