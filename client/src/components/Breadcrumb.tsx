import React from 'react';

interface BreadcrumbItem {
    id: string;
    name: string;
}

interface BreadcrumbProps {
    path: BreadcrumbItem[];
    onNavigate: (folderId: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
    return (
        <nav className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <button
                onClick={() => onNavigate('root')}
                className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="ml-1">My Drive</span>
            </button>

            {path.length > 0 && path.map((item, index) => (
                <React.Fragment key={item.id}>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <button
                        onClick={() => onNavigate(item.id)}
                        className={`hover:text-gray-900 dark:hover:text-white transition-colors ${index === path.length - 1 ? 'font-medium text-gray-900 dark:text-white' : ''
                            }`}
                    >
                        {item.name}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;
