import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-gray-200 dark:border-zinc-700 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
      Built with <span className="text-red-500 mx-1">❤️</span> by{" "}
      <span className="font-medium text-gray-800 dark:text-gray-200">Sathyam</span>.{" "}
      <Link
        href="https://github.com/Sathyam1020/stockly"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
      >
        View on GitHub
      </Link>
    </footer>
  );
}
