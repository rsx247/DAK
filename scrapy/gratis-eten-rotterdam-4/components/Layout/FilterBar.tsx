import React, { useRef, useEffect, ReactNode } from 'react';

interface FilterDropdownProps {
    onClose: () => void;
    children: ReactNode;
    widthClass?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ onClose, children, widthClass = 'w-48' }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={dropdownRef}
            className={`absolute z-10 top-full right-0 mt-2 ${widthClass} origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
        >
            <div className="py-1" role="none">
                {children}
            </div>
        </div>
    );
};