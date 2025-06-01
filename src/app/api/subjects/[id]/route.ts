import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First, fetch the subject to ensure it exists
    const subject = await prisma.subject.findUnique({
      where: { id: params.id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        assignments: {
          orderBy: { dueDate: 'asc' }
        },
        weekProgress: {
          orderBy: { weekNumber: 'asc' }
        }
      }
    });

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    // Now, ensure all weeks exist for this subject
    const existingWeeks = subject.weekProgress;
    const existingWeekNumbers = new Set(existingWeeks.map(w => w.weekNumber));
    const missingWeeks = Array.from({ length: 15 }, (_, i) => i + 1)
      .filter(weekNum => !existingWeekNumbers.has(weekNum));

    if (missingWeeks.length > 0) {
      await Promise.all(missingWeeks.map(weekNumber => 
        prisma.weekProgress.create({
          data: {
            subjectId: params.id,
            weekNumber,
            isCompleted: false,
            isMidterm: false,
            isFinal: false
          }
        })
      ));

      // Re-fetch the subject after creating missing weeks to include them
      const updatedSubject = await prisma.subject.findUnique({
        where: { id: params.id },
        include: {
          notes: {
            orderBy: { createdAt: 'desc' }
          },
          assignments: {
            orderBy: { dueDate: 'asc' }
          },
          weekProgress: {
            orderBy: { weekNumber: 'asc' }
          }
        }
      });

      return NextResponse.json(updatedSubject);
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subject' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, code, instructor } = body;

    const subject = await prisma.subject.update({
      where: { id: params.id },
      data: {
        name,
        code,
        instructor,
      },
      include: {
        assignments: {
          orderBy: { dueDate: 'asc' }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        weekProgress: {
          orderBy: { weekNumber: 'asc' }
        }
      }
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json(
      { error: 'Failed to update subject' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.subject.delete({
      where: { id: params.id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { error: 'Failed to delete subject' },
      { status: 500 }
    );
  }
} 