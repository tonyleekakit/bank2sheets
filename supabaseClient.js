
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 您的 Supabase 專案 URL (我已從您提供的連結中提取了 ID)
const supabaseUrl = 'https://pxxjfgnuueekuffxaoyl.supabase.co'

// 請將您的 Anon Key 貼在這裡
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4eGpmZ251dWVla3VmZnhhb3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNzY5MDQsImV4cCI6MjA4Mzc1MjkwNH0.rhVm2Cf5LYqiy2bvrcZsYTDfdo_D_9-VKLhkdc2jMFY'

export const supabase = createClient(supabaseUrl, supabaseKey)
