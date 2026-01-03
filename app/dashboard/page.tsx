'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase';
import { FiSearch, FiCalendar, FiUser, FiMapPin, FiExternalLink } from 'react-icons/fi';
import { getUserApplications, type Application } from '@/lib/applications';
import JobMatchList from '@/components/JobMatchList';

// ✅ REMOVED: Local Application interface (it's already imported from applications.ts)

export default function DashboardPage(): JSX.Element {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setError(null);
        const apps = await getUserApplications(user.uid);
        if (isMounted) {
          setApplications(apps || []);
        }
      } catch (err) {
        console.error('Error loading applications:', err);
        if (isMounted) {
          setError('Failed to load applications. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FiBriefcase className="w-8 h-8 mr-3 text-blue-600" />
          CareerPilot Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage your job search and applications</p>
      </header>

      {/* AI Job Matches Section */}
      <section className="mb-12">
        <JobMatchList />
      </section>

      {/* Applications Section */}
      <section>
        <div className="flex items-center mb-6">
          <FiCalendar className="w-6 h-6 mr-2 text-gray-700" />
          <h2 className="text-2xl font-semibold text-gray-800">Your Applications</h2>
        </div>

        {applications.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {app.jobTitle}
                    </h3>
                    <p className="text-blue-600 font-medium">{app.company}</p>
                    {app.location && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <FiMapPin className="w-3 h-3 mr-1" />
                        {app.location}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    app.status === 'offer' ? 'bg-green-100 text-green-800' :
                    app.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    app.status === 'screening' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Applied: {new Date().toLocaleDateString()}</span>
                  {app.applyLink && (
                    <a 
                      href={app.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      View Job <FiExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No applications yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Use the AI Job Matches above to start applying!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
