export default function Home() {
  return (
    <main className="flex-1 bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Job Order App
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto text-sm sm:text-base">
          Next.js template successfully initialized with Bun, Zod, React Hook Form, TanStack Query, and Axios.
        </p>
      </div>
    </main>
  );
}
