import { LoaderCircle } from 'lucide-react';

const Loader: React.FC<{ label?: string; className?: string }> = ({ label = 'Loading...', className }) => (
  <div className={`flex flex-col items-center justify-center min-h-screen ${className || ''}`} role="status" aria-live="polite">
    <LoaderCircle className="animate-spin w-8 h-8 text-primary mb-4" aria-hidden="true" />
    <span className="text-sm text-muted-foreground font-medium">{label}</span>
  </div>
);

export default Loader; 