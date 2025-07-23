import { Skeleton } from "@/components/ui/skeleton";
import PollCardSkeleton from "@/components/polls/PollCardSkeleton";

const PollDetailSkeleton = () => (
  <div className="py-12">
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="mb-10">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <div className="flex items-center text-sm text-gray-500 mb-6 space-x-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-6">Vote in this Poll</h2>
        <PollCardSkeleton />
      </div>
    </div>
  </div>
);

export default PollDetailSkeleton;