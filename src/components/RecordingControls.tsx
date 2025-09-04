import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useScreenRecorder } from '@/hooks/useScreenRecorder'
import { Play, Square, Download, RotateCcw, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecordingControlsProps {
  onUpload?: (blob: Blob) => void
  isUploading?: boolean
}

export const RecordingControls = ({ onUpload, isUploading }: RecordingControlsProps) => {
  const {
    recordingState,
    recordingTime,
    recordedVideoUrl,
    recordedBlob,
    startRecording,
    stopRecording,
    resetRecording,
    downloadRecording,
    formatTime,
    maxTime
  } = useScreenRecorder()

  const progressPercentage = (recordingTime / maxTime) * 100

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Recording Card */}
      <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm">
        <div className="p-8 text-center space-y-6">
          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-3">
            <div className={cn(
              "w-4 h-4 rounded-full",
              recordingState === 'recording' ? "bg-recording animate-pulse shadow-recording" : "bg-muted"
            )} />
            <span className={cn(
              "text-lg font-medium",
              recordingState === 'recording' ? "text-recording" : "text-muted-foreground"
            )}>
              {recordingState === 'idle' && 'Ready to Record'}
              {recordingState === 'recording' && 'Recording...'}
              {recordingState === 'stopped' && 'Recording Complete'}
            </span>
          </div>

          {/* Timer */}
          <div className="space-y-4">
            <div className="text-4xl font-bold font-mono">
              {formatTime(recordingTime)}
            </div>
            
            {recordingState === 'recording' && (
              <div className="w-full max-w-md mx-auto space-y-2">
                <Progress 
                  value={progressPercentage} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground">
                  {formatTime(maxTime - recordingTime)} remaining
                </p>
              </div>
            )}
          </div>

          {/* Main Controls */}
          <div className="flex justify-center space-x-4">
            {recordingState === 'idle' && (
              <Button 
                variant="recording"
                size="lg"
                onClick={startRecording}
                className="shadow-glow"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            )}

            {recordingState === 'recording' && (
              <Button 
                variant="secondary"
                size="lg"
                onClick={stopRecording}
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            )}

            {recordingState === 'stopped' && (
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={resetRecording}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  New Recording
                </Button>
                
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={downloadRecording}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>

                {onUpload && recordedBlob && (
                  <Button 
                    variant="primary"
                    size="lg"
                    onClick={() => onUpload(recordedBlob)}
                    disabled={isUploading}
                    className="shadow-glow"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Preview Video */}
      {recordedVideoUrl && (
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recording Preview</h3>
            <video 
              src={recordedVideoUrl}
              controls
              className="w-full rounded-lg shadow-md"
              style={{ maxHeight: '400px' }}
            />
          </div>
        </Card>
      )}
    </div>
  )
}