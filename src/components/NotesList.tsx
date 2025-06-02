'use client';

import Link from 'next/link';
import { Subject , Note } from '@prisma/client';
import DeleteButton from '@/components/DeleteButton';

export default function NotesList({ subject }: { subject: Subject & { notes: Note[] } }) {

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notes</h2>
        <Link
          href={`/university/subjects/${subject.id}/notes/new`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Note
        </Link>
      </div>
      <div className="grid gap-4">
        {subject.notes.map((note) => (
          <div
            key={note.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{note.title}</h3>
                <p className="text-gray-600 mt-2">{note.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
              <DeleteButton
                subjectId={subject.id}
                itemId={note.id}
                itemType="note"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 