import React from 'react';
import {
    TimeIcon,
    DistanceIcon,
    AlphabeticalSortIcon,
    SortIcon,
    FilterIcon,
    PriceIcon,
    AccessIcon,
    EventTypeIcon,
    DietIcon,
    ChevronLeftIcon,
    ReligiousIcon,
    CommunityIcon,
    FoodBankIcon,
    InfoIcon,
    CalendarIcon,
    LinkIcon,
    TagIcon,
    RepeatIcon,
    EditIcon,
    DeleteIcon,
    ExternalLinkIcon,
    ModalIcon,
    PanelIcon,
    TargetIcon,
    EmailIcon,
    PhoneIcon,
    AccessLevelWalkInIcon,
    AccessLevelRegIcon,
    AccessLevelRefIcon,
    CostFreeIcon,
    CostPaidIcon,
    DietaryVegIcon,
    DietaryHalalIcon,
    BreakPatternIcon,
    EyeIcon,
    AddIcon,
    SpinnerIcon,
    WarningIcon,
    CloseIcon,
    ImportIcon,
    ExportIcon,
} from '../Layout/Icons';

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-6 h-6 flex items-center justify-center text-text-secondary">{children}</div>
);

const iconData = [
    { name: 'Sort (Time)', icon: <TimeIcon />, usedIn: 'Header, Filter Bar', functionality: 'Triggers sorting events/venues by time (active first, then upcoming).', states: [{name: 'Default', icon: <TimeIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <TimeIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Sort (Distance)', icon: <DistanceIcon />, usedIn: 'Header, Filter Bar', functionality: 'Triggers sorting venues by distance from the user.', states: [{name: 'Default', icon: <DistanceIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <DistanceIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Sort (Alphabetical)', icon: <AlphabeticalSortIcon />, usedIn: 'Header, Filter Bar', functionality: 'Triggers sorting venues alphabetically by name.', states: [{name: 'Default', icon: <AlphabeticalSortIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <AlphabeticalSortIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Sort (Default)', icon: <SortIcon />, usedIn: 'Header, Filter Bar', functionality: 'Default icon for the sort button before user interaction.', states: [{name: 'Default', icon: <SortIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Filter', icon: <FilterIcon />, usedIn: 'Header', functionality: 'Opens the main filter dropdown or toggles the inline filter bar.', states: [{name: 'Default', icon: <FilterIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <FilterIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Filter (Price)', icon: <PriceIcon />, usedIn: 'Inline Filter Bar', functionality: 'Opens popover to filter events by cost.', states: [{name: 'Default', icon: <PriceIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <PriceIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Filter (Access)', icon: <AccessIcon />, usedIn: 'Inline Filter Bar', functionality: 'Opens popover to filter events by access level.', states: [{name: 'Default', icon: <AccessIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <AccessIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Filter (Event Type)', icon: <EventTypeIcon />, usedIn: 'Inline Filter Bar', functionality: 'Opens popover to filter by meals or packages.', states: [{name: 'Default', icon: <EventTypeIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <EventTypeIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Filter (Diet)', icon: <DietIcon />, usedIn: 'Inline Filter Bar', functionality: 'Opens popover to filter by dietary needs (e.g., vegan).', states: [{name: 'Default', icon: <DietIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Active', icon: <DietIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'View Mode', icon: <EyeIcon />, usedIn: 'Header', functionality: 'Opens dropdown to switch between Timeline, List, and Grid views.', states: [{name: 'Default', icon: <EyeIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Open', icon: <EyeIcon className="w-5 h-5 text-white"/>}] },
    { name: 'Venue (Religious)', icon: <ReligiousIcon />, usedIn: 'Venue Card', functionality: 'Identifies a venue as a religious organization.', states: [{name: 'Default', icon: <ReligiousIcon className="w-5 h-5 text-red-800"/>}] },
    { name: 'Venue (Community)', icon: <CommunityIcon />, usedIn: 'Venue Card', functionality: 'Identifies a venue as a community or social organization.', states: [{name: 'Default', icon: <CommunityIcon className="w-5 h-5 text-green-800"/>}] },
    { name: 'Venue (Food Bank)', icon: <FoodBankIcon />, usedIn: 'Venue Card', functionality: 'Identifies a venue as a food bank.', states: [{name: 'Default', icon: <FoodBankIcon className="w-5 h-5 text-blue-800"/>}] },
    { name: 'Location Pin', icon: <DistanceIcon />, usedIn: 'Venue Card, Event Detail', functionality: 'Indicates location or distance information.', states: [{name: 'Default', icon: <DistanceIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Time / Clock', icon: <TimeIcon />, usedIn: 'Event Detail, Header', functionality: 'Indicates time, date, or duration. Also used for time view dropdown.', states: [{name: 'Default', icon: <TimeIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Information', icon: <InfoIcon />, usedIn: 'Event Detail', functionality: 'Header icon for the "About" section.', states: [{name: 'Default', icon: <InfoIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Calendar', icon: <CalendarIcon />, usedIn: 'Event Detail, Event List', functionality: 'Indicates date or registration deadline information.', states: [{name: 'Default', icon: <CalendarIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'External Link', icon: <LinkIcon />, usedIn: 'Event Detail', functionality: 'Indicates a link to an external source URL.', states: [{name: 'Default', icon: <LinkIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <LinkIcon className="w-5 h-5 text-text-primary"/>}] },
    { name: 'Dietary Tag', icon: <TagIcon />, usedIn: 'Event Detail', functionality: 'Header icon for the "Dietary Needs" section.', states: [{name: 'Default', icon: <TagIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Access Level', icon: <CommunityIcon />, usedIn: 'Event Detail', functionality: 'Indicates the access level (e.g., Walk-in).', states: [{name: 'Default', icon: <CommunityIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Recurrence', icon: <RepeatIcon />, usedIn: 'Event Detail', functionality: 'Indicates that an event is recurring and shows the next date.', states: [{name: 'Default', icon: <RepeatIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Edit', icon: <EditIcon />, usedIn: 'Admin, Event Detail', functionality: 'Opens the form to edit an item.', states: [{name: 'Default', icon: <EditIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <EditIcon className="w-5 h-5 text-blue-600"/>}] },
    { name: 'Delete', icon: <DeleteIcon />, usedIn: 'Admin, Event Detail', functionality: 'Initiates the deletion of an item.', states: [{name: 'Default', icon: <DeleteIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <DeleteIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Registration (URL)', icon: <TargetIcon />, usedIn: 'Event Detail', functionality: 'A button to register via a website link.', states: [{name: 'Default', icon: <TargetIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Registration (Email)', icon: <EmailIcon />, usedIn: 'Event Detail', functionality: 'A button to register via email.', states: [{name: 'Default', icon: <EmailIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Registration (Phone)', icon: <PhoneIcon />, usedIn: 'Event Detail', functionality: 'A button to register via phone call.', states: [{name: 'Default', icon: <PhoneIcon className="w-5 h-5 text-accent"/>}] },
    { name: 'Access (Walk-In)', icon: <AccessLevelWalkInIcon />, usedIn: 'Event List', functionality: 'Indicates an event requires no registration.', states: [{name: 'Default', icon: <AccessLevelWalkInIcon className="w-5 h-5 text-gray-800"/>}] },
    { name: 'Access (Registration)', icon: <AccessLevelRegIcon />, usedIn: 'Event List', functionality: 'Indicates an event requires registration.', states: [{name: 'Default', icon: <AccessLevelRegIcon className="w-5 h-5 text-gray-800"/>}] },
    { name: 'Access (Referral)', icon: <AccessLevelRefIcon />, usedIn: 'Event List', functionality: 'Indicates an event requires a referral.', states: [{name: 'Default', icon: <AccessLevelRefIcon className="w-5 h-5 text-gray-800"/>}] },
    { name: 'Cost (Free)', icon: <CostFreeIcon />, usedIn: 'Event List', functionality: 'Indicates an event is free of charge.', states: [{name: 'Default', icon: <CostFreeIcon className="w-5 h-5 text-gray-800"/>}] },
    { name: 'Cost (Paid)', icon: <CostPaidIcon />, usedIn: 'Event List', functionality: 'Indicates an event has a cost.', states: [{name: 'Default', icon: <CostPaidIcon className="w-5 h-5 text-gray-800"/>}] },
    { name: 'Diet (Veg/Vegan)', icon: <DietaryVegIcon />, usedIn: 'Event List', functionality: 'Indicates vegetarian or vegan options.', states: [{name: 'Default', icon: <DietaryVegIcon className="w-5 h-5 text-green-800"/>}] },
    { name: 'Diet (Halal)', icon: <DietaryHalalIcon />, usedIn: 'Event List', functionality: 'Indicates halal options.', states: [{name: 'Default', icon: <DietaryHalalIcon className="w-5 h-5 text-green-800"/>}] },
    { name: 'Expand/Collapse', icon: <ChevronLeftIcon />, usedIn: 'Timeline Header', functionality: 'Expands or collapses the venue column.', states: [{name: 'Default', icon: <ChevronLeftIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Collapsed Timeline', icon: <BreakPatternIcon />, usedIn: 'Timeline Header', functionality: 'Indicates a collapsed, inactive time segment.', states: [{name: 'Default', icon: <BreakPatternIcon className="w-5 h-5 text-gray-300"/>}] },
    { name: 'Add New', icon: <AddIcon />, usedIn: 'Header, Admin', functionality: 'Opens the form to add a new event or venue.', states: [{name: 'Default', icon: <AddIcon className="w-5 h-5 text-white"/>}] },
    { name: 'Loading Spinner', icon: <SpinnerIcon />, usedIn: 'Geolocation Bar', functionality: 'Indicates that the location is being fetched.', states: [{name: 'Default', icon: <SpinnerIcon className="w-5 h-5 text-gray-500"/>}] },
    { name: 'Warning', icon: <WarningIcon />, usedIn: 'Geolocation Bar', functionality: 'Indicates an error in fetching the location.', states: [{name: 'Default', icon: <WarningIcon className="w-5 h-5 text-yellow-600"/>}] },
    { name: 'Close', icon: <CloseIcon />, usedIn: 'Modals, Detail Panels', functionality: 'Closes the current modal or panel.', states: [{name: 'Default', icon: <CloseIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <CloseIcon className="w-5 h-5 text-text-primary"/>}] },
    { name: 'Import', icon: <ImportIcon />, usedIn: 'Admin', functionality: 'Opens file picker to import data.', states: [{name: 'Default', icon: <ImportIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'Export', icon: <ExportIcon />, usedIn: 'Admin', functionality: 'Downloads all data as a JSON file.', states: [{name: 'Default', icon: <ExportIcon className="w-5 h-5 text-text-secondary"/>}] },
    { name: 'View as Modal', icon: <ModalIcon />, usedIn: 'Event Detail', functionality: 'Changes the detail panel view to a centered modal.', states: [{name: 'Default', icon: <ModalIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <ModalIcon className="w-5 h-5 text-text-primary"/>}] },
    { name: 'View as Panel', icon: <PanelIcon />, usedIn: 'Event Detail', functionality: 'Changes the detail modal view to a side panel.', states: [{name: 'Default', icon: <PanelIcon className="w-5 h-5 text-text-secondary"/>}, {name: 'Hover', icon: <PanelIcon className="w-5 h-5 text-text-primary"/>}] },
];

export const IconLibrary: React.FC = () => {
    const handleExport = () => {
        const dataToExport = iconData.map(item => ({
            name: item.name,
            functionality: item.functionality,
            usedIn: item.usedIn,
            // Cannot serialize React components directly, so we export metadata
            // including the component's display name. For a full AI evaluation,
            // storing the raw SVG strings in iconData would be the next step.
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
                    <ExportIcon className="w-5 h-5" />
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
                    {iconData.map((item, index) => (
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
            </div>
        </div>
    );
};
