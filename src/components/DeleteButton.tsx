'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  subjectId: string;
  itemId: string;
  itemType: 'note' | 'assignment';
}

export default function DeleteButton({ subjectId, itemId, itemType }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${itemType}?`)) {
      return;
    }

    const endpoint = `/api/subjects/${subjectId}/${itemType}s`; // notes or assignments

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [`${itemType}Id`]: itemId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${itemType}`);
      }

      router.refresh();
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      alert(`Failed to delete ${itemType}`);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 p-2"
      title={`Delete ${itemType}`}
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
