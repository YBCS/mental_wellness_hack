import Link from 'next/link';

export default function QuickActions() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/mood-tracker" className="text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            Log Mood
          </Link>
          <Link href="/sleep-tracker" className="text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Log Sleep
          </Link>
          <Link href="/relaxation" className="text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Relaxation
          </Link>
          {/* Add more quick actions as needed */}
        </div>
      </div>
    </div>
  );
}
