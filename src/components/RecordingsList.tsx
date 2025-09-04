import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Download, Calendar, FileVideo, Clock } from 'lucide-react'
import { Recording } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface RecordingsListProps {
  recordings: Recording[]
  loading: boolean
  onRefresh: () => void
}

export const RecordingsList = ({ recordings, loading, onRefresh }: RecordingsListProps) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const { toast } = useToast()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const downloadRecording = async (recording: Recording) => {
    try {
      const response = await fetch(recording.file_url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = recording.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Download started",
        description: `Downloading ${recording.title}`,
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the recording",
        variant: "destructive",
      })
    }
  }

  const togglePlay = (recordingId: string) => {
    setPlayingVideo(playingVideo === recordingId ? null : recordingId)
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-gradient-card border-border/50">
              <div className="p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (recordings.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <div className="p-12 text-center space-y-4">
            <FileVideo className="w-16 h-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-semibold">No recordings yet</h3>
            <p className="text-muted-foreground">
              Create your first screen recording to see it here.
            </p>
            <Button onClick={onRefresh} variant="outline">
              Refresh
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Recordings</h2>
        <Button onClick={onRefresh} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {recordings.map((recording) => (
          <Card key={recording.id} className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow/20 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{recording.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(recording.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileVideo className="w-4 h-4" />
                      <span>{formatFileSize(recording.file_size)}</span>
                    </div>
                    {recording.duration > 0 && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(recording.duration)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {recording.filename.split('.').pop()?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {playingVideo === recording.id && (
                <div className="mb-4">
                  <video 
                    src={recording.file_url}
                    controls
                    autoPlay
                    className="w-full rounded-lg shadow-md"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => togglePlay(recording.id)}
                  className="shadow-glow"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {playingVideo === recording.id ? 'Hide' : 'Play'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadRecording(recording)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}