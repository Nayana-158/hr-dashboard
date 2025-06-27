'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Dialog } from '@headlessui/react'
import UserCard from '@/components/UserCard'

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  department: string
  rating: number
  image: string
}

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState<string[]>([])
  const [ratingFilter, setRatingFilter] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    image: '',
    email: '',
    department: '',
    rating: '1',
  })
  const [page, setPage] = useState(1)

  useEffect(() => {
    const localUsers = localStorage.getItem('customUsers')
    if (localUsers) {
      setUsers(JSON.parse(localUsers))
    }
  }, [])

  useEffect(() => {
    axios.get('https://dummyjson.com/users?limit=100').then((res) => {
      const apiUsers = res.data.users.map((user: any) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        image: user.image,
        department: user.company?.department || 'Unknown',
        rating: Math.floor(Math.random() * 5) + 1,
      }))
      setUsers((prev) => [...prev, ...apiUsers])
    })
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleDeptToggle = (dept: string) => {
    setDeptFilter((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    )
    setPage(1)
  }

  const handleRatingToggle = (rating: number) => {
    setRatingFilter((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    )
    setPage(1)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setForm((prev) => ({ ...prev, image: imageUrl }))
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: User = {
      id: Date.now(),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      age: Number(form.age),
      department: form.department,
      rating: Number(form.rating),
      image: form.image || 'https://via.placeholder.com/150',
    }
    const updated = [newUser, ...users]
    setUsers(updated)
    localStorage.setItem('customUsers', JSON.stringify(updated.filter(u => u.id >= 100000)))
    setForm({ firstName: '', lastName: '', age: '', image: '', email: '', department: '', rating: '1' })
    setIsModalOpen(false)
  }

  const filtered = users.filter((user) => {
    const matchSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.department.toLowerCase().includes(search.toLowerCase())

    const matchDept = deptFilter.length === 0 || deptFilter.includes(user.department)
    const matchRating = ratingFilter.length === 0 || ratingFilter.includes(user.rating)

    return matchSearch && matchDept && matchRating
  })

  const totalPages = Math.ceil(filtered.length / 9)
  const paginatedUsers = filtered.slice((page - 1) * 9, page * 9)

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">HR Dashboard</h1>

     {/* Search & Actions */}
<div className="flex justify-between items-center gap-4 mb-4 flex-wrap">
  <input
    type="text"
    value={search}
    onChange={handleSearch}
    placeholder="Search by name, email, or department"
    className="border p-2 rounded w-full sm:w-auto flex-grow"
  />
  <div className="flex gap-2 flex-wrap">
    <button
      onClick={() => setIsModalOpen(true)}
      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
    >
      ➕ Create User
    </button>
    <a href="/bookmarks">
      <button className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-sm">
        📌 Bookmarks
      </button>
    </a>
    <a href="/analytics">
      <button className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm">
        📊 Analytics
      </button>
    </a>
  </div>
</div>


      {/* Filters */}
      <div className="flex gap-4 flex-wrap mb-4">
        <div>
          <p className="font-medium">Filter by Department:</p>
          {['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Unknown'].map((dept) => (
            <label key={dept} className="mr-2">
              <input
                type="checkbox"
                checked={deptFilter.includes(dept)}
                onChange={() => handleDeptToggle(dept)}
              />{' '}
              {dept}
            </label>
          ))}
        </div>
        <div>
          <p className="font-medium">Filter by Rating:</p>
          {[1, 2, 3, 4, 5].map((r) => (
            <label key={r} className="mr-2">
              <input
                type="checkbox"
                checked={ratingFilter.includes(r)}
                onChange={() => handleRatingToggle(r)}
              />{' '}
              {r}★
            </label>
          ))}
        </div>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {paginatedUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
        {paginatedUsers.length === 0 && (
          <p className="col-span-full text-gray-500">No users match the criteria.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >⬅️ Prev</button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >Next ➡️</button>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-10">
        <div className="fixed inset-0 bg-black bg-opacity-70" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 shadow-md w-full max-w-md z-20">
            <Dialog.Title className="text-xl font-semibold mb-4">Create New User</Dialog.Title>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input required name="firstName" placeholder="First Name" className="border p-2 w-full" value={form.firstName} onChange={handleFormChange} />
              <input required name="lastName" placeholder="Last Name" className="border p-2 w-full" value={form.lastName} onChange={handleFormChange} />
              <input required name="email" type="email" placeholder="Email" className="border p-2 w-full" value={form.email} onChange={handleFormChange} />
              <input required name="age" type="number" placeholder="Age" className="border p-2 w-full" value={form.age} onChange={handleFormChange} />
              <input type="file" accept="image/*" className="border p-2 w-full" onChange={handleFileChange} />
              {form.image && <img src={form.image} alt="Preview" className="w-24 h-24 object-cover rounded" />}
              <input required name="department" placeholder="Department" className="border p-2 w-full" value={form.department} onChange={handleFormChange} />
              <select name="rating" className="border p-2 w-full" value={form.rating} onChange={handleFormChange}>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r.toString()}>{r} Star</option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-1 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1 bg-green-500 text-white rounded">Save</button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </main>
  )
}




