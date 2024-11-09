'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            アカウントにログイン
          </h2>
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Image
            src="/google-icon.svg"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Googleでログイン
        </button>
      </div>
    </div>
  )
}