"use client";

import { useRouter } from "next/navigation";
import DashboardView from "@/components/DashboardView";

export default function DashboardPage() {
  const router = useRouter();

  const handleNavigate = (view: string) => {
    // In the new routing system, we navigate to the actual URL
    const route = view === "dashboard" ? "/dashboard" : `/dashboard/${view.replace("-room", "").replace("-", "")}`;
    router.push(route);
  };

  return (
    <div className="p-8">
      <DashboardView onNavigate={handleNavigate} />
    </div>
  );
}
