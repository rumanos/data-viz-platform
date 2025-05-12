import { Snail } from "lucide-react"
import { AuthForm } from "@/components/AuthForm"
import { useNavigate, useLocation } from 'react-router-dom'

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname.toLowerCase()
  let validMode: 'login' | 'signup' | 'resetPassword' = 'login';
  if (path === '/signup') validMode = 'signup';
  else if (path === '/reset-password') validMode = 'resetPassword';

  const handleModeChange = (newMode: 'login' | 'signup' | 'resetPassword') => {
    if (newMode === 'resetPassword') {
      navigate('/reset-password')
    } else {
      navigate(`/${newMode}`)
    }
  }


  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-3 md:gap-2 font-extrabold text-xl md:text-base pt-10 md:pt-0">
            <div className="flex h-8 w-8 md:h-6 md:w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Snail className="size-6 md:size-4" />
            </div>
            dataviz
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <AuthForm mode={validMode} onModeChange={handleModeChange} />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
         <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent z-10" />
         <img
          src="https://images.pexels.com/photos/57565/pexels-photo-57565.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
} 