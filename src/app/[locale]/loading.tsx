export default function Loading() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='text-center animate-fade-in'>
        <div className='relative mx-auto mb-6'>
          <div className='w-12 h-12 rounded-full border-2 border-primary/20' />
          <div className='absolute inset-0 w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin' />
        </div>
        <span className='text-2xl font-serif font-bold text-gradient-ember tracking-tight'>Kartá</span>
      </div>
    </div>
  );
}
