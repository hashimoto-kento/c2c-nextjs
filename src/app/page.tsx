"use client";

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Clock } from "@/app/components/Clock";
import Link from "next/link";
import { Toaster } from "@/app/components/ui/toaster";

export default function Home() {
  return (
    <div>
      <main className="flext min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">TopPage</h1>
        <Clock />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button>Menu</button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
        <DropdownMenu.Item>
        <Link href="/auth/signin">
          <p>signin</p>
        </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
        <Link href="/auth/signup">
          <p>signup</p>
        </Link>
        </DropdownMenu.Item>
        <Toaster />
        </DropdownMenu.Content>
        </DropdownMenu.Root>
      </main>
    </div>
  );
}
