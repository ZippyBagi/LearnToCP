import { requireAuth } from "@/app/utils/requireAuth";

interface ProblemPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function page({ params }: ProblemPageProps) {
  const { locale, id } = await params;
  await requireAuth(locale, `/${locale}/Problems/${encodeURIComponent(id)}`);

  return <h1>Hello Wolrd</h1>;
}
