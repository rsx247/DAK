import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';

interface FilterDropdownProps {
    onClose: () => void;
    children: React.ReactNode;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ onClose, children }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({ left: 0, right: 'auto' });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                const parentButton = dropdownRef.current.parentElement?.querySelector('button');
                if (parentButton && !parentButton.contains(event.target as Node)) {
                    onClose();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    useLayoutEffect(() => {
        const el = dropdownRef.current;
        const parent = el?.parentElement;
        if (!el || !parent) return;

        const rect = el.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const screenEdgeMargin = 16; 

        let newStyle: React.CSSProperties = { left: 0, right: 'auto' };

        if (rect.right > viewportWidth - screenEdgeMargin) {
            newStyle = { left: 'auto', right: 0 };
        }

        setStyle(newStyle);
    }, []); 

    return (
        <div
            ref={dropdownRef}
            className="absolute z-40 top-full w-48 rounded-b-lg shadow-lg bg-white border-x-2 border-b-2 border-accent"
            style={style}
        >
            {children}
        </div>
    );
};