import { useState, useEffect, useCallback } from 'react'
import { supabase, Recording } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const fetchRecordings = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecordings(data || [])
    } catch (error) {
      console.error('Error fetching recordings:', error)
      toast({
        title: "Failed to load recordings",
        description: "Could not fetch your recordings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const uploadRecording = useCallback(async (blob: Blob) => {
    try {
      setUploading(true)
      
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `screen-recording-${timestamp}.webm`
      
      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(filename, blob, {
          contentType: 'video/webm',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('recordings')
        .getPublicUrl(filename)

      // Calculate duration (approximate from blob size)
      const approximateDuration = Math.floor(blob.size / (1024 * 100)) // Rough estimate

      // Save metadata to database
      const { data: recordingData, error: dbError } = await supabase
        .from('recordings')
        .insert([
          {
            title: `Recording ${new Date().toLocaleDateString()}`,
            filename: filename,
            file_size: blob.size,
            duration: approximateDuration,
            file_url: urlData.publicUrl
          }
        ])
        .select()
        .single()

      if (dbError) throw dbError

      // Update local state
      setRecordings(prev => [recordingData, ...prev])

      toast({
        title: "Upload successful",
        description: "Your recording has been saved",
      })

      return recordingData

    } catch (error) {
      console.error('Error uploading recording:', error)
      toast({
        title: "Upload failed",
        description: "Could not save your recording",
        variant: "destructive",
      })
      throw error
    } finally {
      setUploading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchRecordings()
  }, [fetchRecordings])

  return {
    recordings,
    loading,
    uploading,
    fetchRecordings,
    uploadRecording
  }
}