import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">AI Website Builder</h1>
      <p className="text-gray-600">
        Generate and edit business websites with AI.
      </p>

      <div className="flex gap-4">
        <Link href="/sign-in" className="rounded-lg bg-black px-4 py-2 text-white">
          Sign in
        </Link>
        <Link href="/sign-up" className="rounded-lg border px-4 py-2">
          Sign up
        </Link>
      </div>
    </main>
  );
}