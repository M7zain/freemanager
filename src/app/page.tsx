'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BriefcaseIcon, 
  AcademicCapIcon, 
  ClockIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  const [stats] = useState({
    activeProjects: 5,
    pendingTasks: 12,
    activeSubjects: 4,
    upcomingAssignments: 3,
    hoursThisWeek: 32,
    earningsThisWeek: 2400,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Business Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <BriefcaseIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Active Projects</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Hours This Week</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.hoursThisWeek}</p>
            </div>
          </div>
        </div>

        {/* University Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Active Subjects</h2>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeSubjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Weekly Earnings</h2>
              <p className="text-2xl font-semibold text-gray-900">${stats.earningsThisWeek}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              href="/business/new-project"
              className="block w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add New Project
            </Link>
            <Link 
              href="/university/new-subject"
              className="block w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              Add New Subject
            </Link>
            <Link 
              href="/business/time-entry"
              className="block w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Log Time Entry
            </Link>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Website Redesign</p>
                <p className="text-sm text-gray-500">Due in 2 days</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                Business
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Marketing Assignment</p>
                <p className="text-sm text-gray-500">Due in 5 days</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                University
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
