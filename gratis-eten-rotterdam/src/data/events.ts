import { FoodEvent } from '../types';
import { venues } from './venues';

// Helper to create dates for this week
const getDateThisWeek = (dayOffset: number, hours: number, minutes: number = 0): Date => {
  const now = new Date();
  const date = new Date(now);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Find venue by ID
const getVenue = (id: string) => venues.find(v => v.id === id)!;

// Events that match the prototype-timeline.html exactly
export const foodEvents: FoodEvent[] = [
  // Pauluskerk Rotterdam - Koffie & Broodjes (09:00-21:00, showing 14:00-21:00)
  {
    id: 'event-pauluskerk-koffie-broodjes',
    title: 'Koffie & Broodjes',
    description: 'Koffie en broodjes voor iedereen die het nodig heeft.',
    venue: getVenue('pauluskerk'),
    startTime: getDateThisWeek(0, 9, 0), // Sunday 09:00
    endTime: getDateThisWeek(0, 21, 0),  // Sunday 21:00
    foodType: 'Coffee & snacks',
    dietaryTags: [],
    accessLevel: 'WALK_IN',
    cost: 'Gratis',
    lastVerified: '2024-01-15',
    dataSource: 'website',
    verificationStatus: 'VERIFIED',
  },

  // Rotterdamse Voedsel Service - Halal Voedseluitdeling (15:00-17:00) - happening now
  {
    id: 'event-voedsel-service-halal',
    title: 'Halal Voedseluitdeling',
    description: 'Halal voedselpakketten voor gezinnen in nood.',
    venue: getVenue('voedselbank-rotterdam'),
    startTime: getDateThisWeek(0, 15, 0), // Sunday 15:00
    endTime: getDateThisWeek(0, 17, 0),   // Sunday 17:00
    foodType: 'Food package',
    dietaryTags: ['halal'],
    accessLevel: 'WALK_IN',
    cost: 'Gratis',
    lastVerified: '2024-01-15',
    dataSource: 'website',
    verificationStatus: 'VERIFIED',
  },

  // Stichting Thuisgekookt - Thuisgekookte Maaltijd (16:00-18:00)
  {
    id: 'event-thuisgekookt-maaltijd',
    title: 'Thuisgekookte Maaltijd',
    description: 'Gezonde maaltijd bereid door vrijwilligers. Aanmelden vereist.',
    venue: getVenue('thuisgekookt'),
    startTime: getDateThisWeek(0, 16, 0), // Sunday 16:00
    endTime: getDateThisWeek(0, 18, 0),   // Sunday 18:00
    foodType: 'Warm meal',
    dietaryTags: [],
    accessLevel: 'REGISTRATION',
    cost: 'Gratis',
    lastVerified: '2024-01-15',
    dataSource: 'website',
    verificationStatus: 'VERIFIED',
  },

  // Leger des Heils - Warme Maaltijd (17:00-18:30)
  {
    id: 'event-leger-warme-maaltijd',
    title: 'Warme Maaltijd',
    description: 'Warme maaltijd in een veilige omgeving. Iedereen welkom.',
    venue: getVenue('leger-des-heils'),
    startTime: getDateThisWeek(0, 17, 0), // Sunday 17:00
    endTime: getDateThisWeek(0, 18, 30),  // Sunday 18:30
    foodType: 'Warm meal',
    dietaryTags: [],
    accessLevel: 'WALK_IN',
    cost: 'Gratis',
    lastVerified: '2024-01-15',
    dataSource: 'website',
    verificationStatus: 'VERIFIED',
  },

  // Leger des Heils - Dagopvang Diner (19:00-20:30)
  {
    id: 'event-leger-dagopvang-diner',
    title: 'Dagopvang Diner',
    description: 'Dagopvang diner voor mensen in nood.',
    venue: getVenue('leger-des-heils'),
    startTime: getDateThisWeek(0, 19, 0), // Sunday 19:00
    endTime: getDateThisWeek(0, 20, 30),  // Sunday 20:30
    foodType: 'Warm meal',
    dietaryTags: [],
    accessLevel: 'WALK_IN',
    cost: 'Gratis',
    lastVerified: '2024-01-15',
    dataSource: 'website',
    verificationStatus: 'VERIFIED',
  },
];