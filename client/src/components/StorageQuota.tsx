'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface StorageQuotaProps {
    className?: string;
}

export default function StorageQuota({ className = '' }: StorageQuotaProps) {
    const [usedStorage, setUsedStorage] = useState(0);
    const [totalStorage] = useState(15 * 1024 * 1024 * 1024); // 15GB in bytes
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStorageUsage();
    }, []);

    const fetchStorageUsage = async () => {
        try {
            const res = await api.get('/files/storage-usage');
            if (res.data.usedBytes !== undefined) {
                setUsedStorage(res.data.usedBytes);
            }
        } catch (error) {
            console.error('Failed to fetch storage usage:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const percentage = (usedStorage / totalStorage) * 100;
    const getColor = () => {
        if (percentage < 60) return 'bg-gradient-to-r from-emerald-500 to-teal-500';
        if (percentage < 80) return 'bg-gradient-to-r from-amber-500 to-orange-500';
        return 'bg-gradient-to-r from-rose-500 to-red-500';
    };

    if (loading) {
        return (
            <div className={`${className} p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700`}>
                <div className="skeleton h-4 w-24 mb-3 rounded"></div>
                <div className="skeleton h-2 w-full mb-2 rounded-full"></div>
                <div className="skeleton h-3 w-32 rounded"></div>
            </div>
        );
    }

    return (
        <div className={`${className} p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow animate-fadeIn`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Storage
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {Math.round(percentage)}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <div
                    className={`h-full ${getColor()} transition-all duration-500 ease-out rounded-full relative`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                    {formatBytes(usedStorage)} used
                </span>
                <span className="text-gray-500 dark:text-gray-500">
                    of {formatBytes(totalStorage)}
                </span>
            </div>

            {percentage > 90 && (
                <div className="mt-3 p-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg">
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                        ⚠️ Storage almost full! Consider upgrading.
                    </p>
                </div>
            )}
        </div>
    );
}
