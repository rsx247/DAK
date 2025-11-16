import { Venue } from '../types';

export const venues: Venue[] = [
  // Pauluskerk Rotterdam - matches prototype order
  {
    id: 'pauluskerk',
    name: 'Pauluskerk Rotterdam',
    address: 'Pauluskerkplein 1, 3011 DA Rotterdam',
    city: 'Rotterdam',
    lat: 51.9225,
    lng: 4.4792,
    category: 'RELIGIOUS',
    about: 'Historische kerk in het centrum van Rotterdam die gratis maaltijden en ondersteuning biedt aan mensen in nood.',
    phone: '010-411-2020',
    website: 'https://pauluskerk.nl',
    logoUrl: undefined,
    lastVerified: '2024-01-15',
    dataSource: 'website',
    verificationStatus: 'VERIFIED',
  },

  // Rotterdamse Voedsel Service - matches prototype order (2.8km)
  {
    id: 'voedselbank-rotterdam',
    name: 'Rotterdamse Voedsel Service',
    address: 'Marconistraat 39, 3029 AK Rotterdam',
    city: 'Rotterdam',
    lat: 51.9200,
    lng: 4.4500,
    category: 'FOOD_BANK',
    about: 'Voedselbank die wekelijks voedselpakketten uitdeelt aan gezinnen in nood.',
    phone: '010-476-1234',
    website: 'https://voedselbankrotterdam.nl',
    logoUrl: undefined,
    lastVerified: '2024-01-15',
    dataSource: 'website',
    verificationStatus: 'VERIFIED',
  },

  // Stichting Thuisgekookt - matches prototype order
  {
    id: 'thuisgekookt',
    name: 'Stichting Thuisgekookt',
    address: 'Kruiskade 25, 3012 EH Rotterdam',
    city: 'Rotterdam',
    lat: 51.9250,
    lng: 4.4750,
    category: 'COMMUNITY',
    about: 'Gezonde maaltijden bereid door vrijwilligers voor mensen in nood. Aanmelden vereist via website of telefoon.',
    phone: '010-2345678',
    website: 'https://thuisgekookt.nl',
    logoUrl: undefined,
    lastVerified: '2024-01-15',
    dataSource: 'website',
    verificationStatus: 'VERIFIED',
  },

  // Leger des Heils Rotterdam - matches prototype order
  {
    id: 'leger-des-heils',
    name: 'Leger des Heils Rotterdam',
    address: 'Hoogstraat 81, 3011 PJ Rotterdam',
    city: 'Rotterdam',
    lat: 51.9200,
    lng: 4.4800,
    category: 'RELIGIOUS',
    about: 'Dagopvang en maaltijden voor daklozen en mensen in nood. 24/7 open.',
    phone: '010-411-2020',
    website: 'https://legerdesheils.nl',
    logoUrl: undefined,
    lastVerified: '2024-01-15',
    dataSource: 'website',
    verificationStatus: 'VERIFIED',
  },
];