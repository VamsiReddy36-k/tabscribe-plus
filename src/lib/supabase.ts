import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Recording = {
  id: string
  title: string
  filename: string
  file_size: number
  duration: number
  file_url: string
  created_at: string
}