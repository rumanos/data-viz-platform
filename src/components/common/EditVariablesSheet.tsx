import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { XIcon } from "lucide-react";
import { Button } from '../ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import SearchInput from './SearchInput';
import { VariableSelectionArea } from './VariableSelectionArea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ReusableAccordion';

interface EditVariablesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export function SearchWithActions() {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <SearchInput />
        <div className="flex flex-row sm:flex-row gap-2 w-full sm:w-auto">
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-[#242424] text-white text-[16px] px-4 py-2 border border-[#5A5A5A] rounded-[5px] hover:bg-primary/20 hover:text-primary cursor-pointer"
          >
            <Sparkles size={16} />
            Autofill
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-[#242424] text-[#C9FF3B] text-[16px] px-4 py-2 border border-[#C9FF3B] rounded-[5px] hover:bg-lime-500/10 cursor-pointer"
          >
            <RefreshCw size={16} />
            Rerun
          </button>
        </div>
      </div>
    </div>
  )
}

const EditVariablesSheet: React.FC<EditVariablesSheetProps> = ({ open, onOpenChange }) => {

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full max-w-full! md:w-2xl p-[18px] [&_[data-slot=sheet-close]]:hidden"
      >
        <SheetHeader className="relative flex items-center justify-between flex-row text-[18px] md:text-[24px] font-semibold h-12">
          <SheetTitle>Edit Variables</SheetTitle>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-10 w-10 rounded-full cursor-pointer bg-transparent border-none hover:bg-transparent"
          >
            <XIcon className="size-5" />
          </Button>
        </SheetHeader>


        <div className="container px-4 py-0">
          <SearchWithActions />
          <div className="mt-4">
            <VariableSelectionArea />
          </div>
          {}
          <div className="mt-4"></div>
          <Accordion type="single" defaultValue="item-1" className="space-y-3">
            <AccordionItem value="item-4">
              <AccordionTrigger>Variable Category 1</AccordionTrigger>
              <AccordionContent>
                <p className="text-foreground/40">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-4"></div>
          <Accordion type="single" defaultValue="item-1" className="space-y-3">
            <AccordionItem value="item-4">
              <AccordionTrigger>Variable Category 2</AccordionTrigger>
              <AccordionContent>
                <p className="text-foreground/40">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditVariablesSheet; 