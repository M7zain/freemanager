import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { hours, date, description } = body;

    const timeEntry = await prisma.timeEntry.create({
      data: {
        hours: parseFloat(hours),
        date: new Date(date),
        description,
        projectId: params.id,
      },
    });

    return NextResponse.json(timeEntry);
  } catch (error) {
    console.error('Error creating time entry:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
export const dynamic = 'force-dynamic';
