
import type { FoodEvent, Venue } from '../types';
import { getDateThisWeek } from '../utils/time';

export const sampleVenues: Venue[] = [
  {
    id: 'pauluskerk',
    name: 'Pauluskerk Rotterdam',
    address: 'Mauritsweg 20, 3012 JR Rotterdam',
    city: 'Rotterdam',
    lat: 51.9173,
    lng: 4.473,
    category: 'RELIGIOUS',
    about: 'De Pauluskerk is een plek waar iedereen welkom is voor hulp, een praatje, en een maaltijd.',
    phone: '010-411-2020',
    website: 'https://pauluskerkrotterdam.nl',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'rotterdamse-voedsel-service',
    name: 'Rotterdamse Voedsel Service',
    address: 'Keilestraat 9, 3029 BP Rotterdam',
    city: 'Rotterdam',
    lat: 51.9069,
    lng: 4.4326,
    category: 'FOOD_BANK',
    about: 'Voedselbank voor de regio Rotterdam die wekelijks voedselpakketten verstrekt.',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'stichting-thuisgekookt',
    name: 'Stichting Thuisgekookt',
    address: 'Verschillende locaties',
    city: 'Rotterdam',
    lat: 51.9244,
    lng: 4.4777,
    category: 'COMMUNITY',
    about: 'Verbindt buurtgenoten via een online platform waar thuiskoks maaltijden delen met mensen die niet zelf kunnen koken.',
    website: 'https://thuisgekookt.nl',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'leger-des-heils',
    name: 'Leger des Heils Rotterdam',
    address: 'Gerard Scholtenstraat 41, 3035 SE Rotterdam',
    city: 'Rotterdam',
    lat: 51.9329,
    lng: 4.4815,
    category: 'RELIGIOUS',
    about: 'Biedt opvang, zorg en maaltijden aan dak- en thuislozen en anderen die hulp nodig hebben.',
    verificationStatus: 'VERIFIED'
  }
];

const getVenueById = (id: string): Venue => {
    const venue = sampleVenues.find(v => v.id === id);
    if (!venue) throw new Error(`Venue with id ${id} not found`);
    return venue;
}

export const sampleEvents: FoodEvent[] = [
  {
    id: 'event-pauluskerk-koffie',
    title: 'Koffie & Broodjes',
    description: 'Inloop voor koffie, thee en belegde broodjes. Iedereen is welkom.',
    venueId: 'pauluskerk',
    venue: getVenueById('pauluskerk'),
    startTime: getDateThisWeek(0, 9, 0),
    endTime: getDateThisWeek(0, 21, 0),
    foodType: 'Coffee & snacks',
    dietaryTags: [],
    accessLevel: 'WALK_IN',
    cost: 'Gratis',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'event-voedsel-service',
    title: 'Halal Voedseluitgifte',
    description: 'Uitgifte van voedselpakketten met halal-producten. Registratie vereist.',
    venueId: 'rotterdamse-voedsel-service',
    venue: getVenueById('rotterdamse-voedsel-service'),
    startTime: getDateThisWeek(0, 15, 0),
    endTime: getDateThisWeek(0, 17, 0),
    foodType: 'Packages',
    dietaryTags: ['halal'],
    accessLevel: 'REFERRAL',
    cost: 'Gratis',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'event-thuisgekookt',
    title: 'Warme Maaltijd Afhalen',
    description: 'Een verse, warme maaltijd gekookt door een buur. Aanmelden via de website.',
    venueId: 'stichting-thuisgekookt',
    venue: getVenueById('stichting-thuisgekookt'),
    startTime: getDateThisWeek(0, 16, 0),
    endTime: getDateThisWeek(0, 18, 30),
    foodType: 'Meals',
    dietaryTags: ['vegetarian'],
    accessLevel: 'REGISTRATION',
    cost: 'Vanaf €2',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'event-leger-des-heils-soep',
    title: 'Soepbus',
    description: 'Mobiele soepbus die op verschillende plekken in de stad warme soep en brood uitdeelt.',
    venueId: 'leger-des-heils',
    venue: getVenueById('leger-des-heils'),
    startTime: getDateThisWeek(0, 19, 0),
    endTime: getDateThisWeek(0, 20, 30),
    foodType: 'Meals',
    dietaryTags: [],
    accessLevel: 'WALK_IN',
    cost: 'Gratis',
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'event-pauluskerk-diner',
    title: 'Avondmaaltijd',
    description: 'Warme avondmaaltijd voor iedereen die het nodig heeft.',
    venueId: 'pauluskerk',
    venue: getVenueById('pauluskerk'),
    startTime: getDateThisWeek(0, 17, 30),
    endTime: getDateThisWeek(0, 19, 0),
    foodType: 'Meals',
    dietaryTags: ['vegetarian'],
    accessLevel: 'WALK_IN',
    cost: 'Gratis',
    verificationStatus: 'VERIFIED'
  },
  {
     id: 'event-tomorrow-leger',
     title: 'Ontbijt',
     description: 'Een voedzaam ontbijt om de dag goed te beginnen.',
     venueId: 'leger-des-heils',
     venue: getVenueById('leger-des-heils'),
     startTime: getDateThisWeek(1, 8, 0),
     endTime: getDateThisWeek(1, 10, 0),
     foodType: 'Meals',
     dietaryTags: [],
     accessLevel: 'WALK_IN',
     cost: 'Gratis',
     verificationStatus: 'VERIFIED'
   }
];
