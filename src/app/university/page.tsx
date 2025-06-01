'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Subject {
  id: string;
  name: string;
  code: string;
  instructor: string;
  progress: number;
  weekProgress: WeekProgress[];
}

interface WeekProgress {
  weekNumber: number;
  isCompleted: boolean;
  isMidterm: boolean;
  isFinal: boolean;
}

export default function UniversityPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects');
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        const data = await response.json();
        setSubjects(data);
      } catch (err) {
        setError('Failed to load subjects');
        console.error('Error fetching subjects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const calculateSubjectProgress = (subject: Subject) => {
    if (!subject.weekProgress) return 0;
    const completedWeeks = subject.weekProgress.filter(week => week.isCompleted).length;
    return Math.round((completedWeeks / 15) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
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
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">University Subjects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Current Week: {currentWeek}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/university/new-subject"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Subject
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/university/subjects/${subject.id}`}
                className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {subject.code}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Instructor: {subject.instructor}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${calculateSubjectProgress(subject)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 text-right mt-1">
                      {calculateSubjectProgress(subject)}% Completed
                    </p>
                  </div>

                  {/* Week Indicators */}
                  <div className="mt-4 flex space-x-1">
                    {Array.from({ length: 15 }, (_, i) => i + 1).map((week) => {
                      const weekData = subject.weekProgress?.find(w => w.weekNumber === week);
                      return (
                        <div
                          key={week}
                          className={`w-4 h-4 rounded-full ${
                            weekData?.isCompleted
                              ? 'bg-green-500'
                              : weekData?.isMidterm
                              ? 'bg-yellow-500'
                              : weekData?.isFinal
                              ? 'bg-red-500'
                              : 'bg-gray-200'
                          }`}
                          title={`Week ${week}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 