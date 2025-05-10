import { Snail } from "lucide-react"
import { AuthForm } from "@/components/AuthForm"
import { useAuthStore } from '../store/authStore'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import Loader from '../components/ui/Loader';

export default function AuthPage() {
  const { user, loading: authLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname.toLowerCase()
  const validMode = path === '/signup' ? 'signup' : 'login'
  const handleModeChange = (newMode: 'login' | 'signup') => {
    navigate(`/${newMode}`)
  }

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [authLoading, user, navigate])

  if (authLoading) {
    return <Loader />
  }

  if (user) {
    return null
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-extrabold">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Snail className="size-4" />
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
        <FlickeringGrid
          className="z-0 absolute inset-0 size-full h-full w-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
      </div>
    </div>
  )
} 