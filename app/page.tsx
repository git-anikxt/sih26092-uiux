import { SiteHeader } from '@/components/site-header';

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" />
    </div>
  );
}
