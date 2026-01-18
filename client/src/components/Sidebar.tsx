import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import StorageQuota from './StorageQuota';

interface SidebarProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    onCreateFolder?: () => void;
    onUploadFile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'drive', onTabChange, onCreateFolder, onUploadFile }) => {
    const menuItems = [
        { name: 'My Drive', id: 'drive', href: '/dashboard' },
        { name: 'Shared with me', id: 'shared', href: '/dashboard?tab=shared' },
        { name: 'Recent', id: 'recent', href: '/dashboard?tab=recent' },
        { name: 'Starred', id: 'starred', href: '/dashboard?tab=starred' },
        { name: 'Trash', id: 'trash', href: '/dashboard?tab=trash' },
    ];

    const [isNewMenuOpen, setIsNewMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsNewMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <aside className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">CloudDrive</h1>
            </div>

            <div className="px-4 relative" ref={menuRef}>
                <button
                    onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                    className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                    <span className="text-2xl font-light leading-none mb-1">+</span> New
                </button>

                {isNewMenuOpen && (
                    <div className="absolute top-14 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50">
                        <button
                            onClick={() => {
                                setIsNewMenuOpen(false);
                                onCreateFolder?.();
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-200"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            New Folder
                        </button>
                        <button
                            onClick={() => {
                                setIsNewMenuOpen(false);
                                onUploadFile?.();
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-200"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            File Upload
                        </button>
                    </div>
                )}
            </div>

            <nav className="flex-1 px-2 py-4 space-y-1">
                <button
                    onClick={() => onTabChange?.('drive')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeTab === 'drive' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-medium">My Drive</span>
                </button>

                <button
                    onClick={() => onTabChange?.('shared')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeTab === 'shared' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">Shared with me</span>
                </button>

                <button
                    onClick={() => onTabChange?.('recent')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeTab === 'recent' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Recent</span>
                </button>

                <button
                    onClick={() => onTabChange?.('starred')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeTab === 'starred' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="font-medium">Starred</span>
                </button>

                <button
                    onClick={() => onTabChange?.('trash')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeTab === 'trash' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="font-medium">Trash</span>
                </button>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <StorageQuota />
            </div>
        </aside>
    );
};

export default Sidebar;
