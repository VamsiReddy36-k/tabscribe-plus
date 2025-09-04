import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { VideoIcon, Library } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <VideoIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Screen Recorder
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant={location.pathname === '/' ? 'primary' : 'ghost'}
                size="sm"
              >
                <VideoIcon className="w-4 h-4 mr-2" />
                Record
              </Button>
            </Link>
            <Link to="/recordings">
              <Button 
                variant={location.pathname === '/recordings' ? 'primary' : 'ghost'}
                size="sm"
              >
                <Library className="w-4 h-4 mr-2" />
                Recordings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}