'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CalendarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  category: string;
  description: string | null;
  pricingModel: string;
  hourlyRate: number | null;
  fixedPrice: number | null;
  progress: number;
  status: string;
  timeEntries: TimeEntry[];
  payments: Payment[];
}

interface TimeEntry {
  id: string;
  hours: number;
  date: string;
  description: string | null;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
  paidDate: string | null;
  description: string | null;
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
        console.error('Error fetching project:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'website':
        return 'bg-purple-100 text-purple-800';
      case 'application':
        return 'bg-indigo-100 text-indigo-800';
      case 'digital-marketing':
        return 'bg-pink-100 text-pink-800';
      case 'graphic-design':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalHours = (timeEntries: TimeEntry[] | undefined | null) => {
    if (!timeEntries) return 0;
    return timeEntries.reduce((total, entry) => total + entry.hours, 0);
  };

  const calculateTotalEarnings = (project: Project) => {
    if (project.pricingModel === 'fixed') {
      return project.fixedPrice || 0;
    }
    const totalHours = calculateTotalHours(project.timeEntries);
    return totalHours * (project.hourlyRate || 0);
  };

  const calculateTotalPaid = (payments: Payment[] | undefined | null) => {
    if (!payments) return 0;
    return payments
      .filter(payment => payment.status === 'paid')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error || 'Project not found'}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Projects
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{project.description}</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/business/projects/${project.id}/time-entries/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ClockIcon className="h-5 w-5 mr-2" />
                Add Time Entry
              </Link>
              <Link
                href={`/business/projects/${project.id}/payments/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                Add Payment
              </Link>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getCategoryColor(project.category)}`}>
                    {project.category}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Category</h3>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Status</h3>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Total Hours</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {calculateTotalHours(project.timeEntries).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Total Earnings</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    ${calculateTotalEarnings(project).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Time Entries</h2>
              <Link
                href={`/business/projects/${project.id}/time-entries/new`}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Entry
              </Link>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {project.timeEntries.map((entry) => (
                  <li key={entry.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm font-medium text-gray-900">
                            {entry.hours} hours
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                      {entry.description && (
                        <p className="mt-1 text-sm text-gray-500">{entry.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Payments</h2>
              <Link
                href={`/business/projects/${project.id}/payments/new`}
                className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Payment
              </Link>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {project.payments.map((payment) => (
                  <li key={payment.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm font-medium text-gray-900">
                            ${payment.amount.toFixed(2)}
                          </p>
                          <span className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                          {payment.paidDate && (
                            <span className="ml-2">
                              Paid: {new Date(payment.paidDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {payment.description && (
                        <p className="mt-1 text-sm text-gray-500">{payment.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 