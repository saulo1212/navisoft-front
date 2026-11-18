'use client';
import { useParams } from 'next/navigation';
import KnowledgeArticle from '@/components/KnowledgeArticle';
export default function Page() { const { slug } = useParams(); return <KnowledgeArticle key={slug} slug={slug} />; }
