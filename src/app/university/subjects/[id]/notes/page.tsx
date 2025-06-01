'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Subject } from '@prisma/client';

export default function NotesList({ subject }: { subject: Subject }) {
  const router = useRouter();

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`/api/subjects/${subject.id}/notes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

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
              <button
                onClick={() => handleDelete(note.id)}
                className="text-red-500 hover:text-red-700 p-2"
                title="Delete note"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 