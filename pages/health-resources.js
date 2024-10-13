import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';

export default function HealthResources() {
  return (
    <DashboardLayout>
      <Head>
        <title>Health Resources - Easemind</title>
        <meta name="description" content="Health resources and information" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Health Resources</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          We are constantly updating our information to provide you with the latest health resources.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Mental Health</h2>
              <ul className="space-y-2">
                <li><a href="https://www.nimh.nih.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">National Institute of Mental Health</a></li>
                <li><a href="https://www.nami.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">National Alliance on Mental Illness</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Physical Health</h2>
              <ul className="space-y-2">
                <li><a href="https://www.cdc.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Centers for Disease Control and Prevention</a></li>
                <li><a href="https://www.who.int/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">World Health Organization</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Nutrition</h2>
              <ul className="space-y-2">
                <li><a href="https://www.nutrition.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Nutrition.gov</a></li>
                <li><a href="https://www.eatright.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Academy of Nutrition and Dietetics</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Crisis Helplines</h2>
              <ul className="space-y-2">
                <li><a href="https://suicidepreventionlifeline.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">National Suicide Prevention Lifeline</a></li>
                <li><a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SAMHSA&apos;s National Helpline</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
