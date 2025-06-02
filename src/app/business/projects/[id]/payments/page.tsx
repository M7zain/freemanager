'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface Payment {
  id: string;
  amount: number;
  dueDate: Date;
  status: string;
  projectId: string;
}

export default function ProjectPaymentsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}/payments`);
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [params.id]);

  if (loading) {
    return <div>Loading payments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Payments</h1>
        <Button onClick={() => router.push(`/business/projects/${params.id}/payments/new`)}>
          Add Payment
        </Button>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{formatCurrency(payment.amount)}</span>
                <span className="text-sm text-gray-500">
                  {new Date(payment.dueDate).toLocaleDateString()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Status: {payment.status}</p>
            </CardContent>
          </Card>
        ))}

        {payments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No payments recorded yet.
          </div>
        )}
      </div>
    </div>
  );
} 