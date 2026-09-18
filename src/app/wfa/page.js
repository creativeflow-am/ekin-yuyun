"use client";

import DashboardWfa from "@/components/DashboardWfa";
import { useTasks } from "@/context/TaskContext";
import { SkeletonDashboard } from "@/components/Skeleton";
import { useRouter } from "next/navigation";

export default function WfaPage() {
  const { tasks, isLoading, refreshData } = useTasks();
  const router = useRouter();

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  return (
    <DashboardWfa 
      tasks={tasks} 
      refreshData={refreshData} 
      onOpenForm={() => router.push("/tambah?type=wfa")} 
    />
  );
}
