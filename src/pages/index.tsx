import { Navigation } from '@/components/layout';
import { TokensForm } from '@/components/Tokens';

function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <Navigation />

      <main className="flex flex-1 items-center justify-center p-8 sm:px-10">
        <TokensForm />
      </main>
    </div>
  );
}

export default Home;
