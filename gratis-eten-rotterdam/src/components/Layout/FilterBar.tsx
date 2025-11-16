import { FilterState } from '../../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const handleDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const distance = value === 'all' ? Infinity : parseFloat(value);
    onFilterChange({ ...filters, distance });
  };

  const handleAccessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'ALL' | 'WALK_IN';
    onFilterChange({ ...filters, accessLevel: value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'ALL' | 'MEALS' | 'PACKAGES' | 'MOBILE';
    onFilterChange({ ...filters, eventType: value });
  };

  const handleDietaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'ALL' | 'HALAL' | 'VEGETARIAN' | 'VEGAN';
    onFilterChange({ ...filters, dietary: value });
  };

  const handleOpenNowToggle = () => {
    onFilterChange({ ...filters, openNow: !filters.openNow });
  };

  const handleNoRegistrationToggle = () => {
    onFilterChange({ ...filters, noRegistration: !filters.noRegistration });
  };

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-white border-b border-gray-200">
      {/* Distance Filter - Active */}
      <button
        onClick={() => {
          const distances = [1, 2, 5, Infinity];
          const currentIndex = distances.indexOf(filters.distance);
          const nextIndex = (currentIndex + 1) % distances.length;
          onFilterChange({ ...filters, distance: distances[nextIndex] });
        }}
        className="flex-shrink-0 h-8 px-4 rounded-full border border-primary bg-primary text-white text-[13px] font-medium flex items-center whitespace-nowrap cursor-pointer transition-all hover:shadow-sm active:scale-95"
      >
        📍 {filters.distance === Infinity ? 'Alles' : `${filters.distance} km`}
      </button>

      {/* Access Level Filter */}
      <button
        onClick={() => {
          const accessLevel = filters.accessLevel === 'ALL' ? 'WALK_IN' : 'ALL';
          onFilterChange({ ...filters, accessLevel });
        }}
        className="flex-shrink-0 h-8 px-4 rounded-full border border-gray-200 bg-white text-[13px] font-medium text-gray-900 flex items-center whitespace-nowrap cursor-pointer transition-all hover:shadow-sm active:scale-95 hover:bg-gray-50"
      >
        🚶 Vrije inloop
      </button>

      {/* Event Type Filter */}
      <button
        onClick={() => {
          const types = ['ALL', 'MEALS', 'PACKAGES', 'MOBILE'];
          const currentIndex = types.indexOf(filters.eventType);
          const nextIndex = (currentIndex + 1) % types.length;
          onFilterChange({ ...filters, eventType: types[nextIndex] as any });
        }}
        className="flex-shrink-0 h-8 px-4 rounded-full border border-gray-200 bg-white text-[13px] font-medium text-gray-900 flex items-center whitespace-nowrap cursor-pointer transition-all hover:shadow-sm active:scale-95 hover:bg-gray-50"
      >
        🍽️ Alle types
      </button>

      {/* Open Now Filter */}
      <button
        onClick={handleOpenNowToggle}
        className="flex-shrink-0 h-8 px-4 rounded-full border border-gray-200 bg-white text-[13px] font-medium text-gray-900 flex items-center whitespace-nowrap cursor-pointer transition-all hover:shadow-sm active:scale-95 hover:bg-gray-50"
      >
        🟢 Nu beschikbaar
      </button>
    </div>
  );
}





