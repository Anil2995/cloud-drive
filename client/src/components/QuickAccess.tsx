'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface QuickAccessFile {
    id: string;
    name: string;
    size_bytes: number;
    mime_type: string;
    updated_at: string;
    is_starred?: boolean;
}

interface QuickAccessProps {
    type: 'recent' | 'starred';
    onFileClick?: (file: QuickAccessFile) => void;
}

export default function QuickAccess({ type, onFileClick }: QuickAccessProps) {
    const [files, setFiles] = useState<QuickAccessFile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFiles();
    }, [type]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const endpoint = type === 'recent' ? '/files/recent' : '/files/starred';
            const res = await api.get(endpoint);
            setFiles(res.data.files || []);
        } catch (error) {
            console.error(`Failed to fetch ${type} files:`, error);
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (file: QuickAccessFile) => {
        try {
            const res = await api.get(`/files/${file.id}`);
            if (res.data.downloadUrl) {
                window.open(res.data.downloadUrl, '_blank');
            }
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.includes('image')) return '🖼️';
        if (mimeType.includes('video')) return '🎥';
        if (mimeType.includes('audio')) return '🎵';
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
        if (mimeType.includes('word')) return '📝';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
        if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📊';
        return '📄';
    };

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <div className="skeleton w-10 h-10 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="skeleton h-4 w-48 mb-2 rounded"></div>
                                <div className="skeleton h-3 w-24 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center max-w-md animate-fadeIn">
                    <div className="text-6xl mb-4">
                        {type === 'recent' ? '🕐' : '⭐'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {type === 'recent' ? 'No Recent Files' : 'No Starred Files'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {type === 'recent'
                            ? 'Your recently accessed files will appear here'
                            : 'Star important files to quickly find them here'
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {type === 'recent' ? 'Recent Files' : 'Starred Files'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {files.length} {files.length === 1 ? 'file' : 'files'}
                    </p>
                </div>

                <div className="grid gap-3">
                    {files.map((file, index) => (
                        <div
                            key={file.id}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer animate-fadeIn"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => onFileClick && onFileClick(file)}
                        >
                            <div className="text-3xl group-hover:scale-110 transition-transform">
                                {getFileIcon(file.mime_type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {file.name}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{formatFileSize(file.size_bytes)}</span>
                                    <span>•</span>
                                    <span>{formatDate(file.updated_at)}</span>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(file);
                                }}
                                className="opacity-0 group-hover:opacity-100 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                            >
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
