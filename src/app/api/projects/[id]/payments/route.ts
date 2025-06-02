import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { amount, dueDate } = await request.json();

  const payment = await prisma.payment.create({
    data: {
      amount: parseFloat(amount),
      dueDate: new Date(dueDate),
      status: 'pending',
      projectId: params.projectId,
    },
  });

  return NextResponse.json(payment);
}
