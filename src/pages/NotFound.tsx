import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="flex flex-col items-center justify-center max-w-xl p-6">
        <DotLottieReact
          src="https://lottie.host/ec3faaba-5b6a-42fd-be91-5dc37017a04a/zSwgM6PzmZ.lottie"
          style={{ width: '60%', height: '60%' }}
          loop
          autoplay
        />
        <h1 className="text-4xl font-bold mb-8">Oops!</h1>
        <p className="text-xl mb-8 max-w-xs text-center text-muted-foreground">We can't seem to find the page you're looking for.</p>
        <Button asChild aria-label="Go to home page">
          <Link to="/">Back to home</Link>
        </Button>
      </div>

    </div>
  );
};

export default NotFound; 