"use client";

import DashboardWfo from "@/components/DashboardWfo";
import { useTasks } from "@/context/TaskContext";
import { SkeletonDashboard } from "@/components/Skeleton";
import { useRouter } from "next/navigation";

export default function WfoPage() {
  const { tasks, isLoading, refreshData } = useTasks();
  const router = useRouter();

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  return (
    <DashboardWfo 
      tasks={tasks} 
      refreshData={refreshData} 
      onOpenForm={() => router.push("/tambah?type=wfo")} 
    />
  );
}
