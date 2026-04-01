"use client";

import { useRouter } from "next/navigation";
import DashboardView from "@/components/DashboardView";

export default function DashboardPage() {
  const router = useRouter();

  const handleNavigate = (view: string) => {
    const routes: Record<string, string> = {
      dashboard: "/dashboard",
      "interview-room": "/dashboard/interview",
      "mock-questions": "/dashboard/questions",
      "study-material": "/dashboard/study",
      "personality-dev": "/dashboard/personality",
      "interview-report": "/dashboard/reports",
    };

    const route = routes[view] ?? "/dashboard";
    router.push(route);
  };

  return (
    <div className="p-8">
      <DashboardView onNavigate={handleNavigate} />
    </div>
  );
}
