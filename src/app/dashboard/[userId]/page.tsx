import Link from "next/link";
import TodoSection from "@/app/components/TodoSection";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserDashboard({ }: PageProps) {

  return (
    <div className="container mx-auto px-4 py-8">
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TodoSection />
        {/*
        <WeatherSection />
        <GallerySection />
        <CalendarSection /> */}
        <Link href="/">
          <p>Home</p>
        </Link>
      </main>
    </div>
  );
}