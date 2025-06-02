
import Link from 'next/link';
import { type Subject, type Assignment } from '@prisma/client';
import DeleteButton from '@/components/DeleteButton'; 

type SubjectWithAssignments = Subject & { assignments: Assignment[] };

export default function AssignmentsList({ subject }: { subject: SubjectWithAssignments }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <Link
          href={`/university/subjects/${subject.id}/assignments/new`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Assignment
        </Link>
      </div>
      <div className="grid gap-4">
        {subject.assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{assignment.title}</h3>
                <p className="text-gray-600 mt-2">{assignment.description}</p>
                <div className="flex gap-4 mt-2">
                  <p className="text-sm text-gray-500">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {assignment.status}
                  </p>
                </div>
              </div>
              <DeleteButton
                subjectId={subject.id}
                itemId={assignment.id}
                itemType="assignment"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 