// --- Timeline Zoom Configurations ---
export const zoomConfigs = [
  { slotWidth: 40, rowHeight: 32 }, // Level 0 (Minimal)
  { slotWidth: 80, rowHeight: 80 }, // Level 1 (Default)
];

// --- Venue Column Width Constants (in pixels) ---
const VENUE_COL_WIDTH_EXPANDED_MOBILE = 160;   // w-40
const VENUE_COL_WIDTH_EXPANDED_DESKTOP = 256; // w-64
const VENUE_COL_WIDTH_COLLAPSED_DEFAULT = 80;  // w-20
const VENUE_COL_WIDTH_COLLAPSED_MINIMAL = 48; // w-12

/**
 * Calculates the current width of the venue column based on collapse state,
 * zoom level, and screen width. This ensures the header and timeline grid align perfectly.
 * @param isCollapsed - Whether the venue column is collapsed.
 * @param zoomLevel - The current zoom level of the timeline.
 * @returns The width of the venue column in pixels.
 */
export const getCurrentVenueColumnWidth = (isCollapsed: boolean, zoomLevel: number): number => {
    if (isCollapsed) {
        return zoomLevel === 0 ? VENUE_COL_WIDTH_COLLAPSED_MINIMAL : VENUE_COL_WIDTH_COLLAPSED_DEFAULT;
    }
    
    // This check should be performed where the function is called, 
    // but we can assume a client-side environment for this logic.
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        return VENUE_COL_WIDTH_EXPANDED_DESKTOP;
    }
    
    return VENUE_COL_WIDTH_EXPANDED_MOBILE;
};