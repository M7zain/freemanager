import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, description, pricingModel, hourlyRate, fixedPrice, status } = body;

    const project = await prisma.project.create({
      data: {
        name,
        category,
        description,
        pricingModel,
        hourlyRate: pricingModel === 'hourly' ? parseFloat(hourlyRate) : null,
        fixedPrice: pricingModel === 'fixed' ? parseFloat(fixedPrice) : null,
        status: status || 'active',
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        timeEntries: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 