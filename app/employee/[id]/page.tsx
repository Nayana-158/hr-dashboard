import axios from 'axios'
import { notFound } from 'next/navigation'
import TabsContent from '@/components/TabsContent'

type PageProps = {
  params: {
    id: string
  }
}

const fetchUser = async (id: string) => {
  try {
    const res = await axios.get(`https://dummyjson.com/users/${id}`)
    const user = res.data

    return {
      ...user,
      department: user.company?.department || 'Unknown',
      rating: Math.floor(Math.random() * 5) + 1,
      bio: `Experienced ${user.company?.title || 'employee'} at ${
        user.company?.name || 'Company'
      }. Passionate about innovation and excellence.`,
      history: [
        'Achieved 120% of KPIs in Q1',
        'Improved process automation by 30%',
        'Mentored junior staff on Agile methods',
      ],
    }
  } catch (err) {
    return null
  }
}

export default async function EmployeePage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id)

  if (!user) return notFound()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        {user.firstName} {user.lastName}
      </h1>
      <p className="text-sm text-gray-600 mb-1">Email: {user.email}</p>
      <p className="text-sm text-gray-600 mb-1">Phone: {user.phone}</p>
      <p className="text-sm text-gray-600 mb-1">
        Address: {user.address?.address}, {user.address?.city}, {user.address?.state}
      </p>
      <p className="text-sm text-gray-600 mb-1">Department: {user.department}</p>
      <div className="flex items-center text-yellow-500 mb-2">
        {'⭐'.repeat(user.rating)}{'☆'.repeat(5 - user.rating)}
      </div>
      <p className="italic mb-4">{user.bio}</p>

      <TabsContent user={user} />
    </main>
  )
}
