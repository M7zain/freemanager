'use client';

import { useEffect, useState } from 'react';
import NotesList from '@/components/NotesList';
import AssignmentsList from '@/components/AssignmentsList';
import { Subject, WeekProgress , Assignment, Note } from '@prisma/client';



type SubjectWithWeekProgress = Subject & { assignments: Assignment[] ,  weekProgress: WeekProgress[] , notes: Note[] };


export default function SubjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [subject, setSubject] = useState<SubjectWithWeekProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubject() {
      try {
        const response = await fetch(`/api/subjects/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch subject');
        }
        const data = await response.json();
        setSubject(data);
      } catch (error) {
        console.error('Error fetching subject:', error);
        setError('Failed to load subject details');
      } finally {
        setLoading(false);
      }
    }

    fetchSubject();
  }, [params.id]);

  const handleWeekProgressUpdate = async (weekNumber: number, updates: Partial<WeekProgress>) => {
    // Optimistic update
    const originalSubject = subject;
    if (subject) {
      const updatedWeekProgress = subject.weekProgress.map(week =>
        week.weekNumber === weekNumber ? { ...week, ...updates } : week
      );
      // Create a new subject object with the optimistically updated week progress
      const optimisticallyUpdatedSubject = { ...subject, weekProgress: updatedWeekProgress };
      setSubject(optimisticallyUpdatedSubject);
    }

    try {
      const response = await fetch(`/api/subjects/${params.id}/weeks/${weekNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        // If API update fails, revert to original state
        throw new Error('Failed to update week progress');
      }

      const updatedSubject = await response.json();
      // Set the state with the actual data from the API response
      setSubject(updatedSubject);
    } catch (error) {
      console.error('Error updating week progress:', error);
      // Revert to original state if update fails
      if (originalSubject) {
        setSubject(originalSubject);
      }
      // Optionally show an error notification to the user
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error || 'Subject not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{subject.name}</h1>
        <p className="text-gray-600">Code: {subject.code}</p>
        <p className="text-gray-600">Instructor: {subject.instructor}</p>
      </div>

      <div className="grid gap-8">
        {/* Weekly Progress Tracker */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Progress</h2>
          <div className="grid grid-cols-5 gap-4">
            {subject.weekProgress.sort((a, b) => a.weekNumber - b.weekNumber).map((week) => (
              <div
                key={week.weekNumber}
                className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${
                  week.isCompleted
                    ? 'bg-green-100 text-green-800'
                    : week.isMidterm
                    ? 'bg-yellow-100 text-yellow-800'
                    : week.isFinal
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() =>
                  handleWeekProgressUpdate(week.weekNumber, {
                    isCompleted: !week.isCompleted,
                  })
                }
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (week.isMidterm) {
                    handleWeekProgressUpdate(week.weekNumber, {
                      isMidterm: false,
                      isFinal: true,
                    });
                  } else if (week.isFinal) {
                    handleWeekProgressUpdate(week.weekNumber, {
                      isMidterm: false,
                      isFinal: false,
                    });
                  } else {
                    handleWeekProgressUpdate(week.weekNumber, {
                      isMidterm: true,
                      isFinal: false,
                    });
                  }
                }}
              >
                <div className="font-medium">Week {week.weekNumber}</div>
                <div className="text-xs">
                  {week.isMidterm
                    ? 'Midterm'
                    : week.isFinal
                    ? 'Final'
                    : week.isCompleted
                    ? 'Completed'
                    : 'Pending'}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Left click to mark as completed, right click to cycle through midterm/final
          </p>
        </div>

        <NotesList subject={subject} />
        <AssignmentsList subject={subject} />
      </div>
    </div>
  );
} 