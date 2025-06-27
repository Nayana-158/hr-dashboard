'use client'
import { useBookmarks } from '@/hooks/useBookmarks'

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📌 Bookmarked Employees</h1>

      {bookmarks.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {bookmarks.map((user:any) => (
            <div key={user.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-600">Department: {user.department}</p>
              <div className="flex items-center text-yellow-500">
                {'⭐'.repeat(user.rating)}{'☆'.repeat(5 - user.rating)}
              </div>
cosole.log(bookmarks);
              <div className="mt-3 flex gap-2">
                <button onClick={() => removeBookmark(user.id)} className="text-red-500">
                  Remove
                </button>
                <button className="text-green-600">Promote</button>
                <button className="text-blue-600">Assign to Project</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
