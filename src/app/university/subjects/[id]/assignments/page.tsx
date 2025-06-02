// app/university/subjects/[id]/assignments/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AssignmentsList from '@/components/AssignmentsList'; // Reuse the UI as a component

export default async function Page({ params }: { params: { id: string } }) {
  const subject = await prisma.subject.findUnique({
    where: { id: params.id },
    include: { assignments: true },
  });

  if (!subject) {
    return notFound();
  }

  return <AssignmentsList subject={subject} />;
}
