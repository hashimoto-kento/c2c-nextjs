"use client";

import { Clock } from "@/app/components/Clock";
import Link from "next/link";
import { Toaster } from "./components/ui/toaster";

export default function Home() {
  return (
    <div>
      <main className="flext min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">aaaa</h1>
        <Clock />
        <Link href="/ssg">
          <p>ssg</p>
        </Link>
        <Link href="/user/1">
          <p>user/1</p>
        </Link>
        <Link href="/dashboard/todo">
          <p>Todo</p>
        </Link>
        <Toaster />
      </main>
    </div>
  );
}
