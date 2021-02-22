export interface Activity { // typescriptte interface I şeklinde tanımlanmıyor.
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
  }