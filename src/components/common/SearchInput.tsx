import { Search } from 'lucide-react';

export default function SearchInput() {
  return (
    <div className="relative flex-grow w-full">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={18}
      />
      <input
        type="text"
        placeholder="Search"
        className="w-full pl-10 pr-3 py-2 bg-[#121212] text-white placeholder-gray-400 border border-[#2F2F2F] rounded-[5px] text-[16px] focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-primary/60"
      />
    </div>
  )
}
