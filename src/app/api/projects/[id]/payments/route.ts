import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { amount, dueDate } = body;

    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        status: 'pending',
        projectId: params.id,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 