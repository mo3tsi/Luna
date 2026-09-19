import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BackLink() {
  return (
    <Link to="/profile" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500">
      <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
      Profile
    </Link>
  )
}
