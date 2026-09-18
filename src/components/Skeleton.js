// Skeleton loading components
export function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-2.5 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-6 w-6 bg-slate-200 rounded-lg"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-full mb-1.5"></div>
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm animate-pulse">
      <div className="h-3 bg-slate-200 rounded w-24 mb-3"></div>
      <div className="h-8 bg-slate-200 rounded w-16"></div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="fade-in w-full">
      {/* Header skeleton */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-64 animate-pulse"></div>
        </div>
      </div>

      {/* Filter skeleton */}
      <div className="flex gap-3 mb-6 pb-6 border-b border-slate-200">
        <div className="h-10 bg-slate-200 rounded-md w-32 animate-pulse"></div>
        <div className="h-10 bg-slate-200 rounded-md w-64 animate-pulse"></div>
        <div className="ml-auto h-10 bg-slate-200 rounded-md w-36 animate-pulse"></div>
      </div>

      {/* Desktop table skeleton */}
      <div className="hidden lg:block overflow-x-auto rounded-md border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              {["Tanggal", "Butir Kegiatan SKP", "Deskripsi / Output", "Bukti", "Aksi"].map(h => (
                <th key={h} className="px-4 py-3 text-left">
                  <div className="h-3 bg-slate-300 rounded w-20 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={5} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card skeleton */}
      <div className="lg:hidden mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
