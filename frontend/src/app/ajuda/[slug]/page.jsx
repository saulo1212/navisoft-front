'use client';
import { useDetailParam } from '@/lib/navigation/useDetailParam';
import KnowledgeArticle from '@/components/KnowledgeArticle';
export default function Page() { const slug = useDetailParam('slug'); return <KnowledgeArticle key={slug} slug={slug} />; }
