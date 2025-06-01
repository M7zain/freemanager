import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, instructor } = body;

    const subject = await prisma.subject.create({
      data: {
        name,
        code,
        instructor,
      },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        assignments: true,
        notes: true,
        weekProgress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 