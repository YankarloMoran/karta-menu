export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`skeleton h-4 rounded-lg ${className}`} />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton rounded-3xl p-6 space-y-4 ${className}`}>
      <div className='h-10 w-10 rounded-xl skeleton' />
      <div className='space-y-2'>
        <div className='h-3 w-2/3 rounded skeleton' />
        <div className='h-6 w-1/2 rounded skeleton' />
      </div>
      <div className='h-3 w-1/3 rounded skeleton' />
    </div>
  );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton rounded-[32px] p-6 ${className}`}>
      <div className='h-4 w-48 rounded skeleton mb-6' />
      <div className='h-48 rounded-xl skeleton' />
    </div>
  );
}

export function SkeletonMenuItem({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton rounded-[2rem] overflow-hidden ${className}`}>
      <div className='h-48 skeleton' />
      <div className='p-6 space-y-3'>
        <div className='flex justify-between'>
          <div className='h-5 w-2/3 rounded skeleton' />
          <div className='h-5 w-16 rounded skeleton' />
        </div>
        <div className='h-3 w-full rounded skeleton' />
        <div className='h-3 w-3/4 rounded skeleton' />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className='space-y-10 animate-fade-in'>
      {/* Header */}
      <div className='space-y-3'>
        <div className='h-10 w-72 rounded-xl skeleton' />
        <div className='h-4 w-48 rounded skeleton' />
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} className='h-40' />
        ))}
      </div>

      {/* Chart + Actions */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <SkeletonChart className='lg:col-span-2 h-80' />
        <div className='skeleton rounded-[32px] h-80' />
      </div>
    </div>
  );
}
