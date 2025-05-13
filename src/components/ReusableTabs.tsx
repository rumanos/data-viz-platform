import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger as RadixTabsTrigger } from '@/components/ui/tabs';
import { motion, LayoutGroup } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export type ButtonVariantType = 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;

interface TabConfig {
  key: string;
  label: string; // Label for the tab itself
  content: React.ReactNode;
  icon?: React.ElementType; // Optional icon for the desktop tab
}

interface SearchButtonConfig {
  onClick: () => void;
  icon?: React.ElementType;
  ariaLabel?: string; // Common accessible label for the search button

  // Desktop specific properties
  label?: string; // Text label for desktop search button (e.g., "Search")
  buttonClassName?: string;
  textClassName?: string;
  iconClassName?: string;
  desktopVariant?: ButtonVariantType;
  hideDesktopSearch?: boolean;

  // Mobile specific properties
  mobileLabel?: string; // Text label for mobile search button (often empty for icon-only)
  mobileButtonClassName?: string;
  mobileIconClassName?: string;
  mobileTextClassName?: string;
  mobileVariant?: ButtonVariantType;
  hideMobileSearch?: boolean;
}

interface ReusableTabsProps {
  tabs: TabConfig[];
  defaultValue?: string;
  tabsContentClassName?: string;
  containerClassName?: string;
  headerClassName?: string; 
  tabListContainerClassName?: string; 
  searchButtonConfig?: SearchButtonConfig;
  dropdownTriggerClassName?: string; 
  dropdownContentClassName?: string; 
}

export const ReusableTabs: React.FC<ReusableTabsProps> = ({
  tabs,
  defaultValue,
  tabsContentClassName,
  containerClassName,
  headerClassName,
  tabListContainerClassName,
  searchButtonConfig,
  dropdownTriggerClassName,
  dropdownContentClassName,
}) => {
  if (!tabs || tabs.length === 0) {
    return null;
  }

  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].key);

  useEffect(() => {
    if (defaultValue && defaultValue !== activeTab) {
      setActiveTab(defaultValue);
    }
  }, [defaultValue, activeTab]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const DefaultSearchIcon = Search;
  const currentTabLabel = tabs.find(t => t.key === activeTab)?.label || 'Select Tab';

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange} 
      className={cn("w-full flex-grow flex flex-col gap-0", containerClassName)}
    >
      <div className={cn("px-6 py-4 sticky top-0 z-20 bg-background", headerClassName)}>
        <div className="flex items-center justify-between w-full">
          <LayoutGroup id={`reusable-tabs-desktop-${React.useId()}`}>
            <TabsList className={cn("bg-transparent p-0 hidden md:flex relative", tabListContainerClassName)}>
              {tabs.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                  <div key={tab.key} className="relative flex items-center">
                    {isActive && (
                      <motion.div
                        layoutId="tab-active-bg" 
                        className="absolute inset-0 z-0 bg-[#242424] border border-border shadow-sm rounded-[5px]"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <RadixTabsTrigger
                      value={tab.key}
                      className={cn(
                        "px-4 py-2 font-medium transition-colors duration-150 cursor-pointer relative z-10",
                        "rounded-md",
                        isActive ? 'bg-transparent border-transparent shadow-none text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      )}
                      style={{ background: 'transparent', borderColor: 'transparent' }}
                    >
                      {tab.icon && React.createElement(tab.icon, { className: "w-4 h-4 mr-2" })}
                      {tab.label}
                    </RadixTabsTrigger>
                  </div>
                );
              })}
            </TabsList>
          </LayoutGroup>

          <div className="md:hidden flex items-center ml-auto gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn("flex items-center gap-2 px-3 py-2 rounded-[5px] !bg-primary !text-primary-foreground", dropdownTriggerClassName)}
                >
                  <span>{currentTabLabel}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className={cn("min-w-[10rem]", dropdownContentClassName)}
              >
                {tabs.map((tabConfigItem) => (
                  <DropdownMenuItem
                    key={tabConfigItem.key}
                    onClick={() => handleTabChange(tabConfigItem.key)}
                    className={cn(
                      tabConfigItem.key === activeTab
                        ? '!bg-primary !text-primary-foreground pointer-events-none'
                        : 'hover:bg-accent/80 hover:text-accent-foreground'
                    )}
                  >
                    {tabConfigItem.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {searchButtonConfig && !searchButtonConfig.hideMobileSearch && (
              <Button
                variant={searchButtonConfig.mobileVariant || 'default'}
                className={cn(
                  "flex items-center justify-center px-3 py-2 rounded-[4px]",
                  searchButtonConfig.mobileButtonClassName
                )}
                aria-label={searchButtonConfig.ariaLabel || searchButtonConfig.label || "Search"}
                onClick={searchButtonConfig.onClick}
              >
                {React.createElement(searchButtonConfig.icon || DefaultSearchIcon, {
                  className: cn("w-5 h-5", searchButtonConfig.mobileIconClassName)
                })}
                {searchButtonConfig.mobileLabel && (
                  <span className={cn(searchButtonConfig.mobileTextClassName)}>
                    {searchButtonConfig.mobileLabel}
                  </span>
                )}
              </Button>
            )}
          </div>

          {searchButtonConfig && !searchButtonConfig.hideDesktopSearch && (
            <div className="hidden md:flex items-center ml-4">
              <Button
                variant={searchButtonConfig.desktopVariant || "outline"}
                className={cn(
                  "flex items-center justify-start gap-2 px-4 py-2 cursor-pointer rounded-[5px]",
                  searchButtonConfig.buttonClassName
                )}
                aria-label={searchButtonConfig.ariaLabel || searchButtonConfig.label || "Search"}
                onClick={searchButtonConfig.onClick}
              >
                {React.createElement(searchButtonConfig.icon || DefaultSearchIcon, {
                  className: cn("w-5 h-5", searchButtonConfig.iconClassName)
                })}
                {searchButtonConfig.label && (
                  <span className={cn(searchButtonConfig.textClassName || "hidden sm:inline")}>
                    {searchButtonConfig.label}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.key}
          value={tab.key}
          className={cn("w-full mt-0 flex-1", tabsContentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}; 