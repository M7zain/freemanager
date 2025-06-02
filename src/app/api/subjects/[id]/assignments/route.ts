import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, dueDate } = body;

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        status: 'pending',
        type: 'assignment',
        subjectId: params.id,
      },
    });

    // Fetch updated subject with all related data
    const subject = await prisma.subject.findUnique({
      where: { id: params.id },
      include: {
        assignments: {
          orderBy: {
            dueDate: 'asc',
          },
        },
        notes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        weekProgress: true,
      },
    });

    if (!subject) {
      return new NextResponse('Subject not found', { status: 404 });
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error creating assignment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { assignmentId } = await request.json();

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }

    // Delete the assignment
    await prisma.assignment.delete({
      where: {
        id: assignmentId,
        subjectId: params.id // Ensure the assignment belongs to the subject
      }
    });

    // Fetch the updated subject with assignments
    const updatedSubject = await prisma.subject.findUnique({
      where: { id: params.id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        assignments: {
          orderBy: { dueDate: 'asc' }
        }
      }
    });

    if (!updatedSubject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    // Add default week progress if not available
    const subjectWithWeekProgress = {
      ...updatedSubject,
      weekProgress: updatedSubject.progress || []
    };

    return NextResponse.json(subjectWithWeekProgress);
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    );
  }
} 

export const dynamic = 'force-dynamic';
