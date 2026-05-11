import LandingClient from '@/components/landing/LandingClient';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <LandingClient locale={locale} />;
}
