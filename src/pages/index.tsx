import { Navigation } from '@/components/layout';

function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation />

      <main className="flex flex-1 items-center justify-center p-4 sm:px-6 lg:px-8">
        <article className="text-2xl">
          <h1 className="p-4 text-3xl font-bold text-body underline">
            Hello world!
          </h1>
        </article>
      </main>
    </div>
  );
}

export default Home;
