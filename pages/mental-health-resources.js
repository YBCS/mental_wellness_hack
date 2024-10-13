import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';

export default function MentalHealthResources() {
  return (
    <DashboardLayout>
      <Head>
        <title>Mental Health Resources - Easemind</title>
        <meta name="description" content="Mental health resources and information" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mental Health Resources</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          We are constantly updating our information to provide you with the latest mental health resources.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Crisis Helplines</h2>
              <ul className="space-y-2">
                <li><a href="https://suicidepreventionlifeline.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">National Suicide Prevention Lifeline</a></li>
                <li><a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SAMHSA's National Helpline</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Mental Health Organizations</h2>
              <ul className="space-y-2">
                <li><a href="https://www.nimh.nih.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">National Institute of Mental Health</a></li>
                <li><a href="https://www.nami.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">National Alliance on Mental Illness</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Online Therapy Resources</h2>
              <ul className="space-y-2">
                <li><a href="https://www.betterhelp.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">BetterHelp</a></li>
                <li><a href="https://www.talkspace.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Talkspace</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-4">Self-Help Resources</h2>
              <ul className="space-y-2">
                <li><a href="https://www.mindful.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mindful - Healthy Mind, Healthy Life</a></li>
                <li><a href="https://www.psychologytoday.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Psychology Today</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
