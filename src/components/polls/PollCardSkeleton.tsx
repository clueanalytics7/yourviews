import { Skeleton } from "@/components/ui/skeleton";

const PollCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <Skeleton className="h-6 w-3/4 mb-4" />
    <div className="space-y-3 mb-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="flex justify-between items-center text-sm text-gray-500">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export default PollCardSkeleton;