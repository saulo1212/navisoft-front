'use client';
import { useParams } from 'next/navigation';
import { WorkOrderDetailPage } from '@/components/admin/WorkOrders';
export default function Page() { const { uid } = useParams(); return <WorkOrderDetailPage uid={uid} />; }
