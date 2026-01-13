import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface RenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemType: 'file' | 'folder';
    itemId: string;
    currentName: string;
    onSuccess: () => void;
}

const RenameModal: React.FC<RenameModalProps> = ({
    isOpen,
    onClose,
    itemType,
    itemId,
    currentName,
    onSuccess
}) => {
    const [name, setName] = useState(currentName);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setName(currentName);
    }, [currentName]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || name === currentName) return;

        setLoading(true);
        setError('');

        try {
            const endpoint = itemType === 'folder' ? `/folders/${itemId}` : `/files/${itemId}`;
            await api.patch(endpoint, { name: name.trim() });

            setName('');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.msg || `Failed to rename ${itemType}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Rename {itemType === 'folder' ? 'Folder' : 'File'}
                </h2>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={`${itemType === 'folder' ? 'Folder' : 'File'} name`}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || name === currentName || loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Renaming...' : 'Rename'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RenameModal;
