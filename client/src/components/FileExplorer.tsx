import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import FileContextMenu from './FileContextMenu';
import RenameModal from './RenameModal';
import ShareModal from './ShareModal';

interface Folder {
    id: string;
    name: string;
    created_at: string;
}

interface File {
    id: string;
    name: string;
    size_bytes: number;
    mime_type: string;
    updated_at: string;
}

interface FileExplorerProps {
    currentFolderId: string;
    onFolderClick: (folderId: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ currentFolderId, onFolderClick }) => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Context menu state
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        item: any;
        type: 'file' | 'folder';
    } | null>(null);

    // Rename modal state
    const [renameModal, setRenameModal] = useState<{
        isOpen: boolean;
        itemType: 'file' | 'folder';
        itemId: string;
        currentName: string;
    }>({ isOpen: false, itemType: 'file', itemId: '', currentName: '' });

    // Share modal state
    const [shareModal, setShareModal] = useState<{
        isOpen: boolean;
        itemType: 'file' | 'folder';
        itemId: string;
        itemName: string;
    }>({ isOpen: false, itemType: 'file', itemId: '', itemName: '' });

    useEffect(() => {
        fetchContent();
    }, [currentFolderId]);

    const fetchContent = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/folders/${currentFolderId}`);
            setFolders(res.data.children.folders || []);
            setFiles(res.data.children.files || []);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError('Failed to load folder content');
        } finally {
            setLoading(false);
        }
    };

    const handleContextMenu = (e: React.MouseEvent, item: any, type: 'file' | 'folder') => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            item,
            type
        });
    };

    const handleDownload = async (file: File) => {
        try {
            const res = await api.get(`/files/${file.id}`);
            if (res.data.downloadUrl) {
                window.open(res.data.downloadUrl, '_blank');
            }
        } catch (err) {
            console.error('Download failed:', err);
            alert('Download failed');
        }
    };

    const handleRename = (item: any, type: 'file' | 'folder') => {
        setRenameModal({
            isOpen: true,
            itemType: type,
            itemId: item.id,
            currentName: item.name
        });
    };

    const handleShare = (item: any, type: 'file' | 'folder') => {
        setShareModal({
            isOpen: true,
            itemType: type,
            itemId: item.id,
            itemName: item.name
        });
    };

    const handleDelete = async (item: any, type: 'file' | 'folder') => {
        if (!confirm(`Are you sure you want to move this ${type} to trash?`)) return;

        try {
            const endpoint = type === 'folder' ? `/folders/${item.id}` : `/files/${item.id}`;
            await api.delete(endpoint);
            fetchContent();
        } catch (err) {
            console.error('Delete failed:', err);
            alert(`Failed to delete ${type}`);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading files...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    if (folders.length === 0 && files.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No files or folders</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by uploading a file or creating a folder</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex-1 overflow-auto p-6">
                {/* Folders Section */}
                {folders.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Folders</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {folders.map(folder => (
                                <div
                                    key={folder.id}
                                    onContextMenu={(e) => handleContextMenu(e, folder, 'folder')}
                                    className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                >
                                    <svg onClick={() => onFolderClick(folder.id)} className="w-10 h-10 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                    </svg>
                                    <div onClick={() => onFolderClick(folder.id)} className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{folder.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(folder.created_at)}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRename(folder, 'folder'); }}
                                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                            title="Rename"
                                        >
                                            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(folder, 'folder'); }}
                                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Files Section */}
                {files.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Files</h3>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modified</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {files.map(file => (
                                        <tr
                                            key={file.id}
                                            onContextMenu={(e) => handleContextMenu(e, file, 'file')}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatFileSize(file.size_bytes)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(file.updated_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDownload(file)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        title="Download"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleRename(file, 'file')}
                                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                                        title="Rename"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(file, 'file')}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <FileContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    itemType={contextMenu.type}
                    onClose={() => setContextMenu(null)}
                    onDownload={contextMenu.type === 'file' ? () => handleDownload(contextMenu.item) : undefined}
                    onRename={() => handleRename(contextMenu.item, contextMenu.type)}
                    onShare={() => handleShare(contextMenu.item, contextMenu.type)}
                    onDelete={() => handleDelete(contextMenu.item, contextMenu.type)}
                />
            )}

            {/* Rename Modal */}
            <RenameModal
                isOpen={renameModal.isOpen}
                onClose={() => setRenameModal({ ...renameModal, isOpen: false })}
                itemType={renameModal.itemType}
                itemId={renameModal.itemId}
                currentName={renameModal.currentName}
                onSuccess={fetchContent}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ ...shareModal, isOpen: false })}
                itemType={shareModal.itemType}
                itemId={shareModal.itemId}
                itemName={shareModal.itemName}
            />
        </>
    );
};

export default FileExplorer;
