// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>404 - Page Not Found</h1>
      <p>お探しのページは見つかりませんでした。</p>
      <Link href="/">ホームへ戻る</Link>
    </div>
  );
}
