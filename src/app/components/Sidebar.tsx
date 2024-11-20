"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, CheckSquare, Image, Cloud } from "lucide-react";
import { Clock } from "./Clock";

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "ToDo", href: "/dashboard/todo", icon: CheckSquare },
    { name: "天気", href: "/dashboard/weather", icon: Cloud },
    { name: "カレンダー", href: "/dashboard/calendar", icon: Calendar },
    { name: "ギャラリー", href: "/dashboard/gallery", icon: Image },
  ];

  return (
    <div className="w-64 bg-white shadow-sm h-screen">
      <nav className="mt-5 px-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-6 w-6
                  ${
                    isActive
                      ? "text-gray-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }
                `}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <Clock />
    </div>
  );
}
