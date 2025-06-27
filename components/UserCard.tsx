'use client'

import Link from 'next/link'
import { useBookmarks } from '@/hooks/useBookmarks'
import toast from 'react-hot-toast'

export default function UserCard({ user }: { user: any }) {
  const { addBookmark, removeBookmark, bookmarks } = useBookmarks()
  const isBookmarked = bookmarks.some((u: any) => u.id === user.id)

  return (
    <div className="p-4 border rounded bg-white shadow">
      <img src={user.image} alt={user.firstName} className="w-16 h-16 rounded-full mb-2" />
      <h2 className="font-semibold">{user.firstName} {user.lastName}</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
      <p className="text-sm text-gray-600">Age: {user.age}</p>
      <p className="text-sm text-gray-600">Department: {user.department}</p>

      <div className="flex items-center mt-2 text-yellow-500">
        {'⭐'.repeat(user.rating)}{'☆'.repeat(5 - user.rating)}
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/employee/${user.id}`}>
          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            View
          </button>
        </Link>

        <button
          onClick={() => {
            if (isBookmarked) {
              removeBookmark(user.id)
              toast.error(`${user.firstName} removed from bookmarks`)
            } else {
              addBookmark(user)
              toast.success(`${user.firstName} bookmarked`)
            }
          }}
          className={`px-3 py-1 text-sm rounded ${
            isBookmarked
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
        </button>
      </div>
    </div>
  )
}




  