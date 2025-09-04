import { useState, useRef, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export type RecordingState = 'idle' | 'recording' | 'stopped'

const MAX_RECORDING_TIME = 3 * 60 * 1000 // 3 minutes in milliseconds

export const useScreenRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  
  const { toast } = useToast()

  const startRecording = useCallback(async () => {
    try {
      // Get screen capture with audio
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })

      // Get microphone audio
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })

      // Combine streams
      const combinedStream = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ])

      streamRef.current = combinedStream
      chunksRef.current = []

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9'
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setRecordedVideoUrl(url)
        setRecordedBlob(blob)
        setRecordingState('stopped')
        
        // Clean up streams
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorder.start(1000) // Collect data every second
      setRecordingState('recording')
      startTimeRef.current = Date.now()
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        setRecordingTime(elapsed)
        
        // Auto-stop at max time
        if (elapsed >= MAX_RECORDING_TIME) {
          stopRecording()
        }
      }, 100)

      toast({
        title: "Recording started",
        description: "Your screen is being recorded with audio",
      })

    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: "Recording failed",
        description: "Could not access screen or microphone",
        variant: "destructive",
      })
    }
  }, [toast])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      toast({
        title: "Recording stopped",
        description: "Your recording is ready for preview",
      })
    }
  }, [recordingState, toast])

  const resetRecording = useCallback(() => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl)
    }
    setRecordedVideoUrl(null)
    setRecordedBlob(null)
    setRecordingState('idle')
    setRecordingTime(0)
  }, [recordedVideoUrl])

  const downloadRecording = useCallback(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `screen-recording-${new Date().toISOString().slice(0, 19)}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Download started",
        description: "Your recording is being downloaded",
      })
    }
  }, [recordedBlob, toast])

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [])

  return {
    recordingState,
    recordingTime,
    recordedVideoUrl,
    recordedBlob,
    startRecording,
    stopRecording,
    resetRecording,
    downloadRecording,
    formatTime,
    maxTime: MAX_RECORDING_TIME
  }
}