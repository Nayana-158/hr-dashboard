'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const BookmarksContext = createContext<any>(null)

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<any[]>([])

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('bookmarks')
    if (stored) {
      setBookmarks(JSON.parse(stored))
    }
  }, [])

  // Update localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  const addBookmark = (user: any) => {
    setBookmarks(prev => {
      if (prev.some(item => item.id === user.id)) return prev
      return [...prev, user]
    })
  }

  const removeBookmark = (id: number) => {
    setBookmarks(prev => prev.filter(item => item.id !== id))
  }

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark }}>
      {children}
    </BookmarksContext.Provider>
  )
}

export const useBookmarks = () => {
  const context = useContext(BookmarksContext)
  if (!context) throw new Error('useBookmarks must be used within a BookmarksProvider')
  return context
}





