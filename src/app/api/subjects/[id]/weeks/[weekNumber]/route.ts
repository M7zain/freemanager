import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; weekNumber: string } }
) {
  try {
    const updates = await request.json();
    const weekNumber = parseInt(params.weekNumber);

    // Update or create the week progress
    const weekProgress = await prisma.weekProgress.upsert({
      where: {
        subjectId_weekNumber: {
          subjectId: params.id,
          weekNumber: weekNumber
        }
      },
      update: {
        isCompleted: updates.isCompleted,
        isMidterm: updates.isMidterm,
        isFinal: updates.isFinal
      },
      create: {
        subjectId: params.id,
        weekNumber: weekNumber,
        isCompleted: updates.isCompleted,
        isMidterm: updates.isMidterm,
        isFinal: updates.isFinal
      }
    });

    // Fetch the subject with its related data
    const subject = await prisma.subject.findUnique({
      where: { id: params.id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        assignments: {
          orderBy: { dueDate: 'asc' }
        },
        weekProgress: true
      }
    });

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error updating week progress:', error);
    return NextResponse.json(
      { error: 'Failed to update week progress' },
      { status: 500 }
    );
  }
} 