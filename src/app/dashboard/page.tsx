import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
      <p className="mb-4">ユーザーを選択してください：</p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <Link href="/dashboard/user1" className="text-blue-500 hover:underline">
            ユーザー1のダッシュボード
          </Link>
        </li>
        {/* 必要に応じて他のユーザーリンクを追加 */}
      </ul>
    </div>
  )
}