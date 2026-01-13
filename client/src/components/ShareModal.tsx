import React, { useState } from 'react';
import api from '@/lib/api';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemType: 'file' | 'folder';
    itemId: string;
    itemName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, itemType, itemId, itemName }) => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState<'viewer' | 'editor'>('viewer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [publicLink, setPublicLink] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    if (!isOpen) return null;

    const handleShareWithUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/shares', {
                resource_type: itemType,
                resource_id: itemId,
                grantee_email: email,
                role: permission
            });

            setSuccess(`Successfully shared with ${email}`);
            setEmail('');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to share');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePublicLink = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/shares/link', {
                resource_type: itemType,
                resource_id: itemId,
                role: 'viewer'
            });

            const link = `${window.location.origin}/shared/${res.data.linkId}`;
            setPublicLink(link);
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to create link');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(publicLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Share "{itemName}"</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose how you want to share</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm">
                        {success}
                    </div>
                )}

                {/* Share with specific user */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Share with people</h3>
                    <form onSubmit={handleShareWithUser} className="space-y-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <div className="flex gap-3">
                            <select
                                value={permission}
                                onChange={(e) => setPermission(e.target.value as 'viewer' | 'editor')}
                                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="viewer">Can view</option>
                                <option value="editor">Can edit</option>
                            </select>

                            <button
                                type="submit"
                                disabled={!email.trim() || loading}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Share
                            </button>
                        </div>
                    </form>
                </div>

                {/* Public link */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Get shareable link</h3>

                    {publicLink ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={publicLink}
                                readOnly
                                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                            />
                            <button
                                onClick={handleCopyLink}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                {linkCopied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleCreatePublicLink}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creating link...' : 'Create public link'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
