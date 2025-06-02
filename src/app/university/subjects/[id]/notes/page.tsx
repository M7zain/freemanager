import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import NotesList from '@/components/NotesList';
export default async function Page({ params }: { params: { id: string } }) {
  const subject = await prisma.subject.findUnique({
    where: { id: params.id },
    include: { notes: true },
  });

  if (!subject) {
    return notFound();
  }

  return <NotesList subject={subject} />;
}
