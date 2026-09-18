"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import { useTasks } from "@/context/TaskContext";

function TambahContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "wfo";
  const { refreshData, addTaskLocal } = useTasks();

  const handleClose = () => {
    if (type === "wfa") {
      router.push("/wfa");
    } else {
      router.push("/wfo");
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tambah Jurnal {type === "wfa" ? "WFA" : "WFO"}</h2>
          <p className="text-sm text-slate-500 font-medium">Catat aktivitas harian Anda</p>
        </div>
        <button onClick={handleClose} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800">
          &larr; Kembali
        </button>
      </div>
      <TaskForm 
        isOpen={true} 
        onClose={handleClose} 
        refreshData={refreshData}
        addTaskLocal={addTaskLocal}
        defaultTipeKerja={type === "wfa" ? "WFA" : "WFO"}
      />
    </div>
  );
}

export default function TambahPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TambahContent />
    </Suspense>
  );
}
