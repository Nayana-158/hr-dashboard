// app/layout.tsx
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { BookmarksProvider } from '@/hooks/useBookmarks' // ✅ import provider

export const metadata = {
  title: 'HR Dashboard',
  description: 'Track employee performance',
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BookmarksProvider>
          {children}
          <Toaster position="top-right" />
        </BookmarksProvider>
      </body>
    </html>
  )
}

