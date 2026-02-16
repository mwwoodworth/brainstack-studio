import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 bg-[#0a0a0a]">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-white/10 mb-4">404</div>
        <h2 className="text-lg font-semibold text-white mb-2">Page not found</h2>
        <p className="text-sm text-gray-400 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/30 transition-colors"
        >
          Back to BrainStack Studio
        </Link>
      </div>
    </div>
  );
}
