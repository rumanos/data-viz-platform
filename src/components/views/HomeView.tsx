import React from 'react';
import { ReusableTabs } from '@/components/ReusableTabs';
import { PlaceholderView } from './PlaceholderView';
import { CarFront, ParkingMeter } from 'lucide-react';
import ChargingTabContent from '../ChargingTabContent';

const Tab1Content: React.FC = () => <ChargingTabContent onEditVariables={() => console.log("Edit variables clicked")} />

const Tab2Content: React.FC = () => <PlaceholderView label="Fleet Sizing" icon={<CarFront size={48} className="stroke-1" />} />
const Tab3Content: React.FC = () => <PlaceholderView label="Parking" icon={<ParkingMeter size={48} className="stroke-1"/>} />

const homeTabsConfig = [
  { key: 'charging', label: 'Charging Station', content: <Tab1Content /> }, // Changed value to tab1 to match content
  { key: 'fleet', label: 'Fleet Sizing', content: <Tab2Content /> },
  { key: 'parking', label: 'Parking', content: <Tab3Content /> },
];

export const HomeView: React.FC = () => {
  const handleSearch = () => {
    // eslint-disable-next-line no-console
    console.log('Search button clicked!');
    // Implement search logic here
  };

  return (
    <div className="w-full h-full flex flex-col"> 
      <ReusableTabs
        tabs={homeTabsConfig}
        tabsContentClassName="px-6 py-4 md:bg-[#161618] md:border-t md:border-b md:border-l md:border-border md:rounded-tl-[5px] md:rounded-bl-[5px] flex-1"
        containerClassName="flex-1"
        searchButtonConfig={{
          onClick: handleSearch,
          label: "Search",
          buttonClassName: "md:w-48 lg:w-60",  
        }}
      />
    </div>
  );
};