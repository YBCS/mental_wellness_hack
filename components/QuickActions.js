import Link from 'next/link';

export default function QuickActions() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        <div className="mt-3 grid grid-cols-1 gap-4">
          <Link href="/mood-tracker" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">
            Record Mood
          </Link>
          {/* Add more quick action buttons here */}
        </div>
      </div>
    </div>
  );
}
