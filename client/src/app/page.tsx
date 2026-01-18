'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: "☁️",
      title: "Cloud Storage",
      description: "Store all your files securely in the cloud with enterprise-grade encryption"
    },
    {
      icon: "📁",
      title: "Smart Organization",
      description: "Organize files with folders, tags, and powerful search capabilities"
    },
    {
      icon: "🔗",
      title: "Easy Sharing",
      description: "Share files instantly with customizable permissions and public links"
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your data is protected with end-to-end encryption and secure authentication"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Upload and download files at blazing speeds with our optimized infrastructure"
    },
    {
      icon: "📱",
      title: "Access Anywhere",
      description: "Access your files from any device, anywhere, anytime with responsive design"
    }
  ];

  const stats = [
    { value: "15GB", label: "Free Storage" },
    { value: "99.9%", label: "Uptime" },
    { value: "256-bit", label: "Encryption" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Floating Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-lg py-3' : 'bg-transparent py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              ☁️
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CloudDrive
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-semibold animate-fadeIn">
              🎉 Free 15GB storage for all users
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 animate-fadeIn text-balance">
              Your Files,
              <br />
              <span className="gradient-text">
                Everywhere You Go
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fadeIn text-balance">
              Store, access, and share your important files with enterprise-grade security.
              Experience cloud storage that just works.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fadeIn">
              <Link
                href="/register"
                className="group px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Start Free Today
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 text-lg font-bold text-gray-700 dark:text-white bg-white dark:bg-gray-800 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto border border-gray-200 dark:border-gray-700"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Image/Demo */}
            <div className="relative group animate-fadeIn">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
              <div className="relative rounded-2xl glass shadow-2xl p-1 overflow-hidden">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 aspect-video flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4 animate-bounce">☁️</div>
                    <div className="text-2xl font-bold text-white">
                      Professional Cloud Storage
                    </div>
                    <div className="text-gray-400">
                      Simple. Secure. Scalable.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-white/50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black mb-4 text-gray-900 dark:text-white">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Powerful features designed for modern teams and individuals
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass rounded-3xl p-12 shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust CloudDrive for their file storage needs
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
              >
                Create Free Account
                <span className="text-2xl">→</span>
              </Link>
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                No credit card required • 15GB free storage • Cancel anytime
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                ☁️
              </div>
              <span className="font-bold text-gray-900 dark:text-white">CloudDrive</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2026 CloudDrive. Secure cloud storage for everyone.
            </div>
            <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
