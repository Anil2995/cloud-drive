import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black text-black dark:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="text-2xl font-bold tracking-tighter text-indigo-600 dark:text-indigo-400">
          CloudDrive
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-indigo-600 transition-colors">
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Secure storage for your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              Digital Life
            </span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Store, access, and share your files from anywhere. Secure, reliable, and easy to use.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/register"
              className="px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              Start for Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all w-full sm:w-auto"
            >
              Existing User?
            </Link>
          </div>
        </div>

        {/* Feature Grid / Image Placeholder */}
        <div className="mt-20 w-full rounded-2xl bg-gray-100 dark:bg-gray-800 aspect-video flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden relative">
          <div className="w-1/2 text-center text-gray-400 font-medium">
            App Screenshot Component Placeholder
          </div>
          {/* You could put an actual image here if we had one */}
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800">
        © 2026 CloudDrive. All rights reserved.
      </footer>
    </div>
  );
}
