import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subject = await prisma.subject.findUnique({
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

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Generate a title from the first 50 characters of the content
    const title = content.length > 50 
      ? content.substring(0, 50) + '...' 
      : content;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        subjectId: params.id
      }
    });

    // Fetch the updated subject with notes
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
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { noteId } = await request.json();

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }

    // Delete the note
    await prisma.note.delete({
      where: {
        id: noteId,
        subjectId: params.id // Ensure the note belongs to the subject
      }
    });

    // Fetch the updated subject with notes
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
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 

export const dynamic = 'force-dynamic';
