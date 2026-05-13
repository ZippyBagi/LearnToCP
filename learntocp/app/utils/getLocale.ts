import { useParams } from 'next/navigation'

export default function getLocale(): string {
  const params = useParams();

  const locale = params.locale as string;

  return locale;
}