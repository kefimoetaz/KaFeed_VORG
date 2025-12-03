const PostSkeleton = () => (
  <div className="card p-6 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
    <div className="flex gap-2">
      <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
      <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
      <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
    </div>
  </div>
);

const UserSkeleton = () => (
  <div className="flex items-center gap-3 p-4 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-32"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded-full w-20"></div>
  </div>
);

export { PostSkeleton, UserSkeleton };
export default PostSkeleton;
