"use client";

import OverviewComponent from "@/components/Overview";
import { useTasks } from "@/context/TaskContext";
import { SkeletonDashboard } from "@/components/Skeleton";

export default function OverviewPage() {
  const { tasks, isLoading } = useTasks();

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  return <OverviewComponent tasks={tasks} />;
}
