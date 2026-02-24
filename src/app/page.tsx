import Link from "next/link";
import { VantaBackground } from "@/components/VantaBackground";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-center transition-colors duration-300 relative overflow-hidden">
      <VantaBackground />

      <div className="max-w-2xl w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 space-y-8 animate-in fade-in zoom-in duration-700 border border-white/20 dark:border-slate-800/50 z-10">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-blue-600/20">
              PCC
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My PCC Admin Dashboard
          </h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium">
            Digital Transformation for the Presbyterian Church in Cameroon.
            Manage content, spiritual growth materials, and financial oversight in one place.
          </p>
        </div>

        <div className="grid gap-4 sm:flex sm:justify-center">
          <Link
            href="/auth/login?type=admin"
            className="inline-flex items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 group text-sm sm:text-base"
          >
            Admin Portal Access
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <Link
            href="/auth/login?type=member"
            className="inline-flex items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-all active:scale-95 text-sm sm:text-base"
          >
            Member Services
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-center gap-8">
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Powered by My PCC Platform
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 font-medium z-10 relative">
        © {new Date().getFullYear()} Presbyterian Church in Cameroon. All rights reserved.
      </p>
    </div>
  );
}
