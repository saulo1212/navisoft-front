'use client';
import { useDetailParam } from '@/lib/navigation/useDetailParam';
import { WorkOrderDetailPage } from '@/components/admin/WorkOrders';
export default function Page() { const uid = useDetailParam('uid'); return <WorkOrderDetailPage uid={uid} />; }
