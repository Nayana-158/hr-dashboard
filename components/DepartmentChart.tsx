'use client'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useMemo } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function DepartmentChart() {
  const { bookmarks } = useBookmarks()

  const chartData = useMemo(() => {
    const deptMap: { [key: string]: number[] } = {}

    bookmarks.forEach((user: any) => {
      const dept = user.department || 'Unknown'
      if (!deptMap[dept]) deptMap[dept] = []
      deptMap[dept].push(user.rating || 1)
    })

    const labels = Object.keys(deptMap)
    const averages = labels.map(dept => {
      const ratings = deptMap[dept]
      return ratings.reduce((a, b) => a + b, 0) / ratings.length
    })

    return {
      labels,
      datasets: [
        {
          label: 'Average Rating',
          data: averages,
          backgroundColor: '#3b82f6',
        }
      ]
    }
  }, [bookmarks])

  if (!bookmarks.length) return <p>No bookmarked data to show chart.</p>

  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          title: { display: true, text: 'Department-wise Average Ratings' },
          legend: { display: true },
        },
      }}
    />
  )
}

