import React from "react";

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actionButton?: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, children, className, actionButton }) => {
  return (
    <section className={`relative w-full h-full flex flex-col ${className || ""}`}>
      <div className="flex justify-between items-center mb-1 h-12">
        <h2 className="text-[18px] md:text-[24px] font-semibold">{title}</h2>
        {actionButton}
      </div>
      <div className="relative w-full flex-grow min-h-0">
        {children}
      </div>
      
    </section>
  );
};

export default SectionWrapper; 