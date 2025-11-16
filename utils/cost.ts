/**
 * Parses a cost string (e.g., "€5,00", "Gratis") into a number.
 * Returns Infinity if the cost cannot be determined, so it won't be filtered out.
 * @param costString The string representation of the cost.
 * @returns A number representing the cost.
 */
export const parseCost = (costString: string): number => {
    if (!costString) {
        return 0;
    }
    const lowerCostString = costString.toLowerCase();
    if (lowerCostString.includes('gratis')) {
        return 0;
    }

    // Find the first number in the string, handles "€5,00" and "5.00"
    const match = lowerCostString.match(/(\d+([,.]\d{1,2})?)/);
    if (match) {
        // Replace comma with a dot for float parsing
        const numericString = match[1].replace(',', '.');
        return parseFloat(numericString);
    }
    
    // If no number is found, treat as unknown/unfilterable
    return Infinity; 
};