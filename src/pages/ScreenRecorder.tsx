import { RecordingControls } from '@/components/RecordingControls'
import { useRecordings } from '@/hooks/useRecordings'
import { VideoIcon, Mic, Monitor } from 'lucide-react'
import { Card } from '@/components/ui/card'

const ScreenRecorder = () => {
  const { uploadRecording, uploading } = useRecordings()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-6">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow">
                <VideoIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Screen Recorder
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Record your screen with crystal-clear audio. Perfect for tutorials, presentations, and demos.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <Card className="bg-gradient-card border-border/50 shadow-card p-6 text-center">
              <Monitor className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Screen Capture</h3>
              <p className="text-sm text-muted-foreground">
                Record any browser tab or your entire screen in high quality
              </p>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 shadow-card p-6 text-center">
              <Mic className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Audio Recording</h3>
              <p className="text-sm text-muted-foreground">
                Capture system audio and microphone simultaneously
              </p>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 shadow-card p-6 text-center">
              <VideoIcon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Easy Sharing</h3>
              <p className="text-sm text-muted-foreground">
                Download recordings or upload them to the cloud instantly
              </p>
            </Card>
          </div>
        </div>

        {/* Recording Controls */}
        <RecordingControls 
          onUpload={uploadRecording}
          isUploading={uploading}
        />
      </div>
    </div>
  )
}

export default ScreenRecorder