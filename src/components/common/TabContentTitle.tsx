import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { History, MoreVertical, Upload } from "lucide-react";

interface TabContentTitleProps {
  title: string;
  icon?: React.ReactNode;
  onHistoryClick?: () => void;
  onEditVariablesClick?: () => void;
  onUploadClick?: () => void;
}

const TabContentTitle: React.FC<TabContentTitleProps> = ({
  title,
  icon,
  onHistoryClick,
  onEditVariablesClick,
  onUploadClick,
}) => {
  return (
    <div className="w-full flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        {icon && <span className="text-foreground">{icon}</span>}
        <h1 className="text-[18px] md:text-[24px] font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Desktop-only History Button */}
        {onHistoryClick && (
          <Button
            variant="default"
            onClick={onHistoryClick}
            className="hidden md:flex items-center gap-1 bg-[#242424] text-[16px] text-white hover:bg-primary/20 hover:text-primary border-[0.67px] border-[#5A5A5A] rounded-[5px] cursor-pointer"
          >
            <History className="w-4 h-4" />
          </Button>
        )}

        {/* Desktop-only Edit Variables Button */}
        {onEditVariablesClick && (
          <Button
            variant="default"
            onClick={onEditVariablesClick}
            className="hidden md:inline-flex bg-[#242424] text-[16px] text-white hover:bg-primary/20 hover:text-primary border-[0.67px] border-[#5A5A5A] rounded-[5px] cursor-pointer"
          >
            Edit Variables
          </Button>
        )}

        {/* Mobile-only Dropdown for History and Edit Variables */}
        {(onHistoryClick || onEditVariablesClick) && (
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="More actions"
                  className="bg-[#242424] text-[16px] text-white hover:bg-primary/20 hover:text-primary border-[0.67px] border-[#5A5A5A] rounded-[5px] cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onHistoryClick && (
                  <DropdownMenuItem onClick={onHistoryClick}>
                    <History className="mr-2 h-4 w-4" />
                    <span>History</span>
                  </DropdownMenuItem>
                )}
                {onEditVariablesClick && (
                  <DropdownMenuItem onClick={onEditVariablesClick}>
                    {/* Consider adding an icon for Edit Variables if available */}
                    <span>Edit Variables</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Upload Button - visible on all screen sizes */}
        {onUploadClick && (
          <Button
            size="icon"
            aria-label="Upload"
            onClick={onUploadClick}
            className="bg-[#242424] text-[16px] text-white hover:bg-primary/20 hover:text-primary border-[0.67px] border-[#5A5A5A] rounded-[5px] cursor-pointer"
          >
            <Upload className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TabContentTitle;
