import type { Metadata } from "next";
import { pageMetadata } from "@/app/utils/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const description =
    locale === "sr"
      ? "O projektu LearnToCP - besplatna platforma za učenje takmičarskog programiranja."
      : "About LearnToCP - a free platform for learning competitive programming.";
  return pageMetadata({
    locale,
    path: "about-us",
    title: locale === "sr" ? "O nama" : "About",
    description,
  });
}

export default function Page() {
  return <h1>About Us Page</h1>;
}
