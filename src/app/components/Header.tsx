'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Personal Dashboard</h1>
        {session?.user && (
          <div className="flex items-center space-x-4">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || ''}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  )
}