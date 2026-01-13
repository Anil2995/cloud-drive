'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import FileExplorer from '@/components/FileExplorer';
import CreateFolderModal from '@/components/CreateFolderModal';
import UploadModal from '@/components/UploadModal';
import Breadcrumb from '@/components/Breadcrumb';
import api from '@/lib/api';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string>('drive');
    const [currentFolderId, setCurrentFolderId] = useState('root');
    const [breadcrumbPath, setBreadcrumbPath] = useState<Array<{ id: string, name: string }>>([]);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Update breadcrumb when folder changes
        if (currentFolderId !== 'root') {
            // In a real app, fetch folder hierarchy from backend
            // For now, just clear breadcrumb for non-root
            setBreadcrumbPath([]);
        } else {
            setBreadcrumbPath([]);
        }
    }, [currentFolderId]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch();
            } else {
                setSearchResults([]);
                setIsSearching(false);
            }
        }, 300); // Debounce search

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    const performSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchResults(res.data.results || []);
        } catch (err) {
            console.error('Search failed:', err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleFolderCreated = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleUploadClick = () => {
        setIsUploadOpen(true);
    };

    const handleBreadcrumbNavigate = (folderId: string) => {
        setCurrentFolderId(folderId);
        setSearchQuery(''); // Clear search when navigating
    };

    const handleSearchResultClick = (result: any) => {
        if (result.type === 'folder') {
            setCurrentFolderId(result.id);
            setSearchQuery('');
        } else {
            // Download file
            api.get(`/files/${result.id}`).then(res => {
                if (res.data.downloadUrl) {
                    window.open(res.data.downloadUrl, '_blank');
                }
            });
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-pulse text-indigo-600 font-semibold">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onCreateFolder={() => setIsCreateFolderOpen(true)}
                onUploadFile={handleUploadClick}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center shadow-sm z-10">
                    <div className="flex-1 min-w-0">
                        <div className="max-w-xl relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search in CloudDrive"
                                    className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-indigo-500"
                                />
                                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Search Results Dropdown */}
                            {searchQuery && (
                                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-gray-500">Searching...</div>
                                    ) : searchResults.length > 0 ? (
                                        <div>
                                            {searchResults.map(result => (
                                                <button
                                                    key={result.id}
                                                    onClick={() => handleSearchResultClick(result)}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                                >
                                                    {result.type === 'folder' ? (
                                                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{result.name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{result.type === 'folder' ? 'Folder' : 'File'}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium hidden sm:block">
                            {user.name}
                        </span>
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Breadcrumb Navigation */}
                <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
                    <Breadcrumb path={breadcrumbPath} onNavigate={handleBreadcrumbNavigate} />
                </div>

                {/* Content Area - Conditional based on active tab */}
                {activeTab === 'drive' && (
                    <FileExplorer
                        key={refreshKey}
                        currentFolderId={currentFolderId}
                        onFolderClick={(folderId) => {
                            setCurrentFolderId(folderId);
                            setSearchQuery('');
                        }}
                    />
                )}

                {activeTab === 'shared' && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Files shared with you</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">When someone shares a file or folder with you, it will appear here</p>
                        </div>
                    </div>
                )}

                {activeTab === 'recent' && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Recent files</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your recently accessed files will appear here</p>
                        </div>
                    </div>
                )}

                {activeTab === 'starred' && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Starred files</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Star your important files and they'll appear here</p>
                            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Click the star icon on any file to mark it as favorite</p>
                        </div>
                    </div>
                )}

                {activeTab === 'trash' && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Trash is empty</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Items you delete will appear here</p>
                            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Deleted items are permanently removed after 30 days</p>
                        </div>
                    </div>
                )}
            </div>

            <CreateFolderModal
                isOpen={isCreateFolderOpen}
                onClose={() => setIsCreateFolderOpen(false)}
                currentFolderId={currentFolderId}
                onSuccess={handleFolderCreated}
            />

            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                currentFolderId={currentFolderId}
                onSuccess={handleFolderCreated}
            />
        </div>
    );
}
