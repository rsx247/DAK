import React from 'react';
import * as Icons from '../Layout/Icons';

interface IconLibraryProps {
    searchQuery: string;
}

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-6 h-6 flex items-center justify-center text-text-secondary">{children}</div>
);

const iconData = [
    { name: 'Sort (Time)', icon: <Icons.TimeIcon />, usedIn: 'Header, Filter Bar', functionality: 'Triggers sorting events/venues by time (active first, then upcoming).', states: [{name: 'Default', icon: <Icons.TimeIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <Icons.TimeIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Sort (Distance)', icon: <Icons.DistanceIcon />, usedIn: 'Header, Filter Bar', functionality: 'Triggers sorting venues by distance from the user.', states: [{name: 'Default', icon: <Icons.DistanceIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <Icons.DistanceIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Sort (Alphabetical)', icon: <Icons.AlphabeticalSortIcon />, usedIn: 'Header, Filter Bar', functionality: 'Triggers sorting venues alphabetically by name.', states: [{name: 'Default', icon: <Icons.AlphabeticalSortIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <Icons.AlphabeticalSortIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Sort (Default)', icon: <Icons.SortIcon />, usedIn: 'Header, Filter Bar', functionality: 'Default icon for the sort button before user interaction.', states: [{name: 'Default', icon: <Icons.SortIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Filter', icon: <Icons.FilterIcon />, usedIn: 'Header', functionality: 'Opens the main filter dropdown or toggles the inline filter bar.', states: [{name: 'Default', icon: <Icons.FilterIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <Icons.FilterIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Filter (Price)', icon: <Icons.PriceIcon />, usedIn: 'Inline Filter Bar', functionality: 'Opens popover to filter events by cost.', states: [{name: 'Default', icon: <Icons.PriceIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <Icons.PriceIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Filter (Access)', icon: <Icons.AccessIcon />, usedIn: 'Inline Filter Bar', functionality: 'Opens popover to filter events by access level.', states: [{name: 'Default', icon: <Icons.AccessIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <Icons.AccessIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Filter (Event Type)', icon: <Icons.EventTypeIcon />, usedIn: 'Inline Filter Bar', functionality: 'Opens popover to filter by meals or packages.', states: [{name: 'Default', icon: <Icons.EventTypeIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <Icons.EventTypeIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Filter (Diet)', icon: <Icons.DietIcon />, usedIn: 'Inline Filter Bar', functionality: 'Opens popover to filter by dietary needs (e.g., vegan).', states: [{name: 'Default', icon: <Icons.DietIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <Icons.DietIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'View Mode', icon: <Icons.EyeIcon />, usedIn: 'Header', functionality: 'Opens dropdown to switch between Timeline, List, and Grid views.', states: [{name: 'Default', icon: <Icons.EyeIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Open', icon: <Icons.EyeIcon className="w-5 h-5 text-white"/>}] },
    { name: 'Venue (Religious)', icon: <Icons.ReligiousIcon />, usedIn: 'Venue Card', functionality: 'Identifies a venue as a religious organization.', states: [{name: 'Default', icon: <Icons.ReligiousIcon className="w-5 h-5 text-red-800"/>}] },
    { name: 'Venue (Community)', icon: <Icons.CommunityIcon />, usedIn: 'Venue Card', functionality: 'Identifies a venue as a community or social organization.', states: [{name: 'Default', icon: <Icons.CommunityIcon className="w-5 h-5 text-green-800"/>}] },
    { name: 'Venue (Food Bank)', icon: <Icons.FoodBankIcon />, usedIn: 'Venue Card', functionality: 'Identifies a venue as a food bank.', states: [{name: 'Default', icon: <Icons.FoodBankIcon className="w-5 h-5 text-blue-800"/>}] },
    { name: 'Location Pin', icon: <Icons.PinIcon />, usedIn: 'Venue Card, Event Detail', functionality: 'Indicates location or distance information.', states: [{name: 'Default', icon: <Icons.PinIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Information', icon: <Icons.InfoIcon />, usedIn: 'Event Detail', functionality: 'Header icon for the "About" section.', states: [{name: 'Default', icon: <Icons.InfoIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Calendar', icon: <Icons.CalendarIcon />, usedIn: 'Event Detail, Event List', functionality: 'Indicates date or registration deadline information.', states: [{name: 'Default', icon: <Icons.CalendarIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'External Link', icon: <Icons.LinkIcon />, usedIn: 'Event Detail', functionality: 'Indicates a link to an external source URL.', states: [{name: 'Default', icon: <Icons.LinkIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <Icons.LinkIcon className="w-5 h-5 text-text-primary"/>}] },
    { name: 'Dietary Tag', icon: <Icons.TagIcon />, usedIn: 'Event Detail', functionality: 'Header icon for the "Dietary Needs" section.', states: [{name: 'Default', icon: <Icons.TagIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Access Level', icon: <Icons.UserGroupIcon />, usedIn: 'Event Detail', functionality: 'Indicates the access level (e.g., Walk-in).', states: [{name: 'Default', icon: <Icons.UserGroupIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Recurrence', icon: <Icons.RepeatIcon />, usedIn: 'Event Detail', functionality: 'Indicates that an event is recurring and shows the next date.', states: [{name: 'Default', icon: <Icons.RepeatIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Edit', icon: <Icons.EditIcon />, usedIn: 'Admin, Event Detail', functionality: 'Opens the form to edit an item.', states: [{name: 'Default', icon: <Icons.EditIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <Icons.EditIcon className="w-5 h-5 text-blue-600"/>}] },
    { name: 'Delete', icon: <Icons.DeleteIcon />, usedIn: 'Admin, Event Detail', functionality: 'Initiates the deletion of an item.', states: [{name: 'Default', icon: <Icons.DeleteIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <Icons.DeleteIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Registration (URL)', icon: <Icons.TargetIcon />, usedIn: 'Event Detail', functionality: 'A button to register via a website link.', states: [{name: 'Default', icon: <Icons.TargetIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Registration (Email)', icon: <Icons.EmailIcon />, usedIn: 'Event Detail', functionality: 'A button to register via email.', states: [{name: 'Default', icon: <Icons.EmailIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Registration (Phone)', icon: <Icons.PhoneIcon />, usedIn: 'Event Detail', functionality: 'A button to register via phone call.', states: [{name: 'Default', icon: <Icons.PhoneIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Access (Walk-In)', icon: <Icons.AccessLevelWalkInIcon />, usedIn: 'Event List', functionality: 'Indicates an event requires no registration.', states: [{name: 'Default', icon: <Icons.AccessLevelWalkInIcon className="w-5 h-5 text-gray-800"/>}] },
    { name: 'Access (Registration)', icon: <Icons.AccessLevelRegIcon />, usedIn: 'Event List', functionality: 'Indicates an event requires registration.', states: [{name: 'Default', icon: <Icons.AccessLevelRegIcon className="w-5 h-5 text-gray-800"/>}] },
    { name: 'Access (Referral)', icon: <Icons.AccessLevelRefIcon />, usedIn: 'Event List', functionality: 'Indicates an event requires a referral.', states: [{name: 'Default', icon: <Icons.AccessLevelRefIcon className="w-5 h-5 text-gray-800"/>}] },
    { name: 'Cost (Free)', icon: <Icons.CostFreeIcon />, usedIn: 'Event List', functionality: 'Indicates an event is free of charge.', states: [{name: 'Default', icon: <Icons.CostFreeIcon className="w-5 h-5 text-gray-800"/>}] },
    { name: 'Cost (Paid)', icon: <Icons.CostPaidIcon />, usedIn: 'Event List', functionality: 'Indicates an event has a cost.', states: [{name: 'Default', icon: <Icons.CostPaidIcon className="w-5 h-5 text-gray-800"/>}] },
    { name: 'Diet (Veg/Vegan)', icon: <Icons.DietaryVegIcon />, usedIn: 'Event List', functionality: 'Indicates vegetarian or vegan options.', states: [{name: 'Default', icon: <Icons.DietaryVegIcon className="w-5 h-5 text-green-800"/>}] },
    { name: 'Diet (Halal)', icon: <Icons.DietaryHalalIcon />, usedIn: 'Event List', functionality: 'Indicates halal options.', states: [{name: 'Default', icon: <Icons.DietaryHalalIcon className="w-5 h-5 text-green-800"/>}] },
    { name: 'Expand/Collapse', icon: <Icons.ChevronLeftIcon />, usedIn: 'Timeline Header', functionality: 'Expands or collapses the venue column.', states: [{name: 'Default', icon: <Icons.ChevronLeftIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Collapsed Timeline', icon: <Icons.BreakPatternIcon />, usedIn: 'Timeline Header', functionality: 'Indicates a collapsed, inactive time segment.', states: [{name: 'Default', icon: <Icons.BreakPatternIcon className="w-5 h-5 text-gray-300"/>}] },
    { name: 'Add New', icon: <Icons.AddIcon />, usedIn: 'Header, Admin', functionality: 'Opens the form to add a new event or venue.', states: [{name: 'Default', icon: <Icons.AddIcon className="w-5 h-5 text-white"/>}] },
    { name: 'Loading Spinner', icon: <Icons.SpinnerIcon />, usedIn: 'Geolocation Bar', functionality: 'Indicates that the location is being fetched.', states: [{name: 'Default', icon: <Icons.SpinnerIcon className="w-5 h-5 text-gray-500"/>}] },
    { name: 'Warning', icon: <Icons.WarningIcon />, usedIn: 'Geolocation Bar', functionality: 'Indicates an error in fetching the location.', states: [{name: 'Default', icon: <Icons.WarningIcon className="w-5 h-5 text-yellow-600"/>}] },
    { name: 'Close', icon: <Icons.CloseIcon />, usedIn: 'Modals, Detail Panels', functionality: 'Closes the current modal or panel.', states: [{name: 'Default', icon: <Icons.CloseIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <Icons.CloseIcon className="w-5 h-5 text-text-primary"/>}] },
    { name: 'Import', icon: <Icons.ImportIcon />, usedIn: 'Admin', functionality: 'Opens file picker to import data.', states: [{name: 'Default', icon: <Icons.ImportIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Export', icon: <Icons.ExportIcon />, usedIn: 'Admin', functionality: 'Downloads all data as a JSON file.', states: [{name: 'Default', icon: <Icons.ExportIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'View as Modal', icon: <Icons.ModalIcon />, usedIn: 'Event Detail', functionality: 'Changes the detail panel view to a centered modal.', states: [{name: 'Default', icon: <Icons.ModalIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <Icons.ModalIcon className="w-5 h-5 text-text-primary"/>}] },
    { name: 'View as Panel', icon: <Icons.PanelIcon />, usedIn: 'Event Detail', functionality: 'Changes the detail modal view to a side panel.', states: [{name: 'Default', icon: <Icons.PanelIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <Icons.PanelIcon className="w-5 h-5 text-text-primary"/>}] },
    { name: 'Zoom In', icon: <Icons.ZoomInIcon />, usedIn: 'Timeline', functionality: 'Increases the zoom level of the timeline view.', states: [{name: 'Default', icon: <Icons.ZoomInIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Zoom Out', icon: <Icons.ZoomOutIcon />, usedIn: 'Timeline', functionality: 'Decreases the zoom level of the timeline view.', states: [{name: 'Default', icon: <Icons.ZoomOutIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Empty State Search', icon: <Icons.EmptyStateSearchIcon />, usedIn: 'Empty State', functionality: 'Visual indicator for the "no results" message.', states: [{name: 'Default', icon: <Icons.EmptyStateSearchIcon className="w-16 h-16 text-gray-400"/>}] },
    { name: 'Reset All Filters', icon: <Icons.ResetAllIcon />, usedIn: 'Header', functionality: 'Button to reset all active filters to their default state.', states: [{name: 'Default', icon: <Icons.ResetAllIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Theme (Sun)', icon: <Icons.SunIcon />, usedIn: 'Header', functionality: 'Visual indicator for light mode.', states: [{name: 'Default', icon: <Icons.SunIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Theme (Moon)', icon: <Icons.MoonIcon />, usedIn: 'Header', functionality: 'Visual indicator for dark mode.', states: [{name: 'Default', icon: <Icons.MoonIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'GPS Tracking', icon: <Icons.GpsTrackingIcon />, usedIn: 'Geolocation Bar', functionality: 'Indicates location is set manually or that the default is being used.', states: [{name: 'Default', icon: <Icons.GpsTrackingIcon className="w-5 h-5 text-text-secondary"/>}] },
];

export const IconLibrary: React.FC<IconLibraryProps> = ({ searchQuery }) => {
    const handleExport = () => {
        const dataToExport = iconData.map(item => ({
            name: item.name,
            functionality: item.functionality,
            usedIn: item.usedIn,
            componentName: (item.icon.type as React.FC).displayName || (item.icon.type as React.FC).name || 'Unknown',
            states: item.states.map(s => ({
                name: s.name,
                componentName: (s.icon.type as React.FC).displayName || (s.icon.type as React.FC).name || 'Unknown',
            })),
        }));

        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = `icon-library-data-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const filteredIcons = React.useMemo(() => {
        if (!searchQuery) {
            return iconData;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return iconData.filter(item => 
            item.name.toLowerCase().includes(lowercasedQuery) ||
            item.usedIn.toLowerCase().includes(lowercasedQuery) ||
            item.functionality.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery]);

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-border-color">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-text-primary">Icon Library</h2>
                    <p className="text-sm text-text-secondary mt-1">A reference for all custom icons used in the application.</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center self-start sm:self-center space-x-2 px-4 py-2 text-sm font-medium rounded-md border border-border-color text-text-secondary bg-white hover:bg-surface transition-colors"
                >
                    <Icons.ExportIcon className="w-5 h-5" />
                    <span>Export as JSON</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-surface">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left font-semibold text-text-secondary w-16">Icon</th>
                            <th scope="col" className="px-4 py-3 text-left font-semibold text-text-secondary">Name</th>
                            <th scope="col" className="px-4 py-3 text-left font-semibold text-text-secondary">Place</th>
                            <th scope="col" className="px-4 py-3 text-left font-semibold text-text-secondary">States</th>
                        </tr>
                    </thead>
                    {filteredIcons.map((item, index) => (
                        <tbody key={index} className="border-t border-border-color hover:bg-surface/50 transition-colors">
                            <tr>
                                <td className="px-4 pt-3 pb-1 align-top">
                                    <IconWrapper>{item.icon}</IconWrapper>
                                </td>
                                <td className="px-4 pt-3 pb-1 align-top font-medium text-text-primary">{item.name}</td>
                                <td className="px-4 pt-3 pb-1 align-top text-text-secondary">{item.usedIn}</td>
                                <td className="px-4 pt-3 pb-1 align-top">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {item.states.map((state, stateIndex) => (
                                            <div key={stateIndex} className="flex flex-col items-center p-1 text-center" title={state.name}>
                                                <div className="w-5 h-5 mb-1">{state.icon}</div>
                                                <span className="text-[10px] text-text-secondary">{state.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="px-4 pb-3 text-xs text-text-secondary">
                                    {item.functionality}
                                </td>
                            </tr>
                        </tbody>
                    ))}
                </table>
                 {filteredIcons.length === 0 && (
                    <div className="text-center py-10 text-text-secondary">
                        Geen iconen gevonden voor "{searchQuery}".
                    </div>
                )}
            </div>
        </div>
    );
};