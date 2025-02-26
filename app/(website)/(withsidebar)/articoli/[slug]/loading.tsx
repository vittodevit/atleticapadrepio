import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="p-4">
      <Skeleton className="h-[200px] w-full rounded-md mb-3" />
      <Skeleton className="h-[20px] w-1/2 rounded-md mb-3" />
      <Skeleton className="h-[20px] w-1/3 rounded-md mb-3" />
      <Skeleton className="h-[100px] w-full rounded-md mb-3" />
    </div>
  );
}