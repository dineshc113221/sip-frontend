   
export const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T): number => {
    // Convert string numbers to actual numbers for comparison if sorting by 'weight'
    if (orderBy === "material_pct" || orderBy==='percentage' || orderBy==='carbonFootprint' || orderBy==='envFootprint' || orderBy==='gaiaScore') {
      const numA = parseFloat(a[orderBy] as string) || 0;
      const numB = parseFloat(b[orderBy] as string) || 0;
      return numB - numA; // Descending order
    }
  
    if (b[orderBy] < a[orderBy]) {
      return -1;
    } else if (b[orderBy] > a[orderBy]) {
      return 1;
    } else {
      return 0;
    }
  };
  // Function to get a comparator based on order direction
  export const getComparator = <T,>(order: "asc" | "desc", orderBy: keyof T) => {
    return order === "desc"
      ? (a: T, b: T) => descendingComparator(a, b, orderBy)
      : (a: T, b: T) => -descendingComparator(a, b, orderBy);
  };
  
  // Function to sort an array stably
  export const stableSort = <T,>(
    array: T[],
    comparator: (a: T, b: T) => number
  ): T[] => {
    return array
      .map((el, index) => [el, index] as [T, number])
      .sort((a, b) => {
        const order = comparator(a[0], b[0]);
        return order !== 0 ? order : a[1] - b[1];
      })
      .map((el) => el[0]);
  };
  