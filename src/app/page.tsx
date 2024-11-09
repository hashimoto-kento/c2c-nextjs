"use client";

import { Clock } from "@/app/components/Clock";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flext min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">aaaa</h1>
        {/* <Clock /> */}
        <Link href="/ssg">
          <p>ssg</p>
        </Link>
        <Link href="/user/1">
          <p>user/1</p>
        </Link>
      </main>
    </div>
  );
}
