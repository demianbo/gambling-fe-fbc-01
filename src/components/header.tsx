import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b">
      <div className="text-lg font-semibold">GamblingApp</div>
      <div className="flex gap-2">
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </header>
  )
}