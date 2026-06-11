import { requireAuth } from "@/app/utils/requireAuth";

interface ProblemsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function page({ params }: ProblemsPageProps) {
  const { locale } = await params;
  await requireAuth(locale, `/${locale}/Problems`);

  return <h1>Problems Page</h1>;
}
