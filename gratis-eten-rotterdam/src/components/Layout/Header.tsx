import { FilterState } from '../../types';
import { FilterBar } from './FilterBar';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function Header({ filters, onFilterChange }: HeaderProps) {
  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <h1 className="text-[22px] font-semibold text-gray-900 mb-0.5">
            Gratis Eten Rotterdam
          </h1>
          <p className="text-[13px] text-gray-600">
            Vind gratis maaltijden in jouw buurt
          </p>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar filters={filters} onFilterChange={onFilterChange} />
    </>
  );
}





