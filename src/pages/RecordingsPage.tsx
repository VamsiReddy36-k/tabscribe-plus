import { RecordingsList } from '@/components/RecordingsList'
import { useRecordings } from '@/hooks/useRecordings'
import { Library, VideoIcon } from 'lucide-react'

const RecordingsPage = () => {
  const { recordings, loading, fetchRecordings } = useRecordings()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow">
                <Library className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Your Recordings
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage, preview, and download all your screen recordings in one place.
            </p>
          </div>
        </div>

        <RecordingsList 
          recordings={recordings}
          loading={loading}
          onRefresh={fetchRecordings}
        />
      </div>
    </div>
  )
}

export default RecordingsPage