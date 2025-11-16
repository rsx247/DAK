
import type { EventData, Venue } from '../types';

export const allVenues: Venue[] = [
    {
      "id": "venue-1",
      "name": "Pauluskerk",
      "address": "Mauritsweg 20, 3012 JR Rotterdam",
      "city": "Rotterdam",
      "lat": 51.9182,
      "lng": 4.4716,
      "category": "RELIGIOUS",
      "about": "De Pauluskerk is een plek waar iedereen welkom is voor een praatje, een kop koffie en een warme maaltijd.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/pauluskerk.webp",
      "verificationStatus": "VERIFIED"
    },
    {
      "id": "venue-2",
      "name": "Leger des Heils Centrum",
      "address": "Schiedamsesingel 183, 3012 BB Rotterdam",
      "city": "Rotterdam",
      "lat": 51.9135,
      "lng": 4.4758,
      "category": "COMMUNITY",
      "about": "Het Leger des Heils biedt opvang en ondersteuning aan dak- en thuislozen, inclusief maaltijdvoorziening.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/leger-des-heils-centrum.webp",
      "verificationStatus": "VERIFIED"
    },
    {
      "id": "venue-4",
      "name": "Buurthuis De Malle Molen",
      "address": "Gerrit van de Lindestraat 1, 3022 TC Rotterdam",
      "city": "Rotterdam",
      "lat": 51.9168,
      "lng": 4.4445,
      "category": "COMMUNITY",
      "about": "Een gezellige ontmoetingsplek in de wijk waar regelmatig gekookt wordt voor en door buurtbewoners.",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-5",
      "name": "Stichting Perla's Vriend",
      "address": "Teldersweg 255, Rotterdam",
      "city": "Rotterdam",
      "lat": 51.952896,
      "lng": 4.470305,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/perlas-vriend.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-6",
      "name": "Huis van de wijk de Inloop / WMO radar",
      "address": "Bulgaarsestraat 4, Rotterdam",
      "city": "Rotterdam",
      "lat": 51.915053,
      "lng": 4.420912,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/huisvdwijk.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-7",
      "name": "Samen Eten Kleyburg",
      "address": "Wessel Gansfortweg, Schiebroek",
      "city": "Rotterdam",
      "lat": 51.948241,
      "lng": 4.473875,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-8",
      "name": "Huis van de Wijk Post West / WMO radar",
      "address": "Tidemanstraat 80, Rotterdam",
      "city": "Rotterdam",
      "lat": 51.917225,
      "lng": 4.448314,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/huisvdwijk.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-9",
      "name": "Huis van de wijk Schiemond / WMO radar",
      "address": "Dempostraat 143, Rotterdam",
      "city": "Rotterdam",
      "lat": 51.903365,
      "lng": 4.441355,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/huisvdwijk.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-10",
      "name": "Natuurtalent",
      "address": "Veldkersweg 50, Rotterdam",
      "city": "Rotterdam",
      "lat": 51.968223,
      "lng": 4.471385,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-11",
      "name": "WMO radar Huiskamer Het Wijktrefpunt",
      "address": "Oostkousdijk 14A, Rotterdam",
      "city": "Rotterdam",
      "lat": 51.904283,
      "lng": 4.454086,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/huisvdwijk.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-12",
      "name": "Huis vd Wijk Westervolkshuis / WMO radar",
      "address": "Spartastraat 1, Rotterdam",
      "city": "Rotterdam",
      "lat": 51.919779,
      "lng": 4.435389,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/huisvdwijk.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-13",
      "name": "Wijkcentrum De Erker",
      "address": "Jan van Avennesstraat 32, Schiedam",
      "city": "Schiedam",
      "lat": 51.912855,
      "lng": 4.388778,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/de-erker.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-14",
      "name": "Wijkhuis Oost",
      "address": "Boerhaavelaan 79, Schiedam",
      "city": "Schiedam",
      "lat": 51.916281,
      "lng": 4.412126,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-15",
      "name": "Resto vanHarte: Buurtrestaurant",
      "address": "Van Beethovenplein 161, Schiedam",
      "city": "Schiedam",
      "lat": 51.92882,
      "lng": 4.367401,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/resto-vanharte-buurtrestaurant.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-16",
      "name": "Dock Schiedam Zuid",
      "address": "Groenelaan 59, Schiedam",
      "city": "Schiedam",
      "lat": 51.906229,
      "lng": 4.403927,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/dock.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-17",
      "name": "DOCK Schiedam Nieuwland",
      "address": "Dreesplein 1, Schiedam",
      "city": "Schiedam",
      "lat": 51.922508,
      "lng": 4.393894,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/dock.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-18",
      "name": "Inloop Spinhuispad",
      "address": "Spinhuispad 19, Schiedam",
      "city": "Schiedam",
      "lat": 51.919673,
      "lng": 4.397168,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/inloop-spinhuispad.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-19",
      "name": "BuurtBuik Rotterdam West",
      "address": "Rösener Manzstraat 80, 3026 TV Rotterdam",
      "city": "Rotterdam",
      "lat": 51.912525,
      "lng": 4.44148,
      "category": "COMMUNITY",
      "about": "Gratis maaltijden gemaakt van gered voedsel. Iedereen is welkom.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/buurtbuik.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-20",
      "name": "BuurtBuik Rotterdam Zuid",
      "address": "Pretorialaan 141, 3072 EL Rotterdam",
      "city": "Rotterdam",
      "lat": 51.898796,
      "lng": 4.50046,
      "category": "COMMUNITY",
      "about": "Gratis maaltijden gemaakt van gered voedsel. Iedereen is welkom.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/buurtbuik.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-21",
      "name": "Bij de Provenier",
      "address": "Proveniersstraat 6, 3033 CJ Rotterdam",
      "city": "Rotterdam",
      "lat": 51.927713,
      "lng": 4.474202,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/gaarkeuken.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-22",
      "name": "Onder de Oranjeboom",
      "address": "Oranjeboomstraat 313, 3071 SR Rotterdam",
      "city": "Rotterdam",
      "lat": 51.905398,
      "lng": 4.510003,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/gaarkeuken.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-23",
      "name": "Dorpsveld",
      "address": "Eksterstraat 101, 3083 XA Rotterdam",
      "city": "Rotterdam",
      "lat": 51.888527,
      "lng": 4.473573,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/gaarkeuken.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-24",
      "name": "Dijkveld",
      "address": "Huniadijk 251, 3079 EH Rotterdam",
      "city": "Rotterdam",
      "lat": 51.880262,
      "lng": 4.54151,
      "category": "COMMUNITY",
      "about": "Informatie onbekend",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/gaarkeuken.webp",
      "verificationStatus": "NEEDS_VERIFICATION"
    },
    {
      "id": "venue-25",
      "name": "Inloop- en Bijbelhuis 'In de Gouwstraat'",
      "address": "Gouwstraat 36b, 3082 BD Rotterdam",
      "city": "Rotterdam",
      "lat": 51.8922272,
      "lng": 4.4682135,
      "category": "RELIGIOUS",
      "about": "Een evangelisatiecentrum waar iedereen welkom is voor activiteiten, maaltijden en gemeenschap. Elke vrijdagavond wordt er een maaltijdavond gehouden.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/inloop-en-bijbelhuis-in-de-gouwstraat.webp",
      "verificationStatus": "VERIFIED"
    },
    {
      "id": "venue-26",
      "name": "Audarya Dhaam Tempel",
      "address": "Schiekade 99c, 3033 BE Rotterdam",
      "city": "Rotterdam",
      "lat": 51.9278788,
      "lng": 4.4739299,
      "category": "RELIGIOUS",
      "about": "Stichting Hare Krsna Kerkgenootschap. Organiseert Food For Life Rotterdam evenementen waarbij gratis 100% plantaardig-vegan maaltijden worden uitgedeeld.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/audarya-tempel.webp",
      "verificationStatus": "VERIFIED"
    },
    {
      "id": "venue-27",
      "name": "Maaltijd en Meer",
      "address": "Coloniastraat 25, 3024 TA Rotterdam",
      "city": "Rotterdam",
      "lat": 51.9056656,
      "lng": 4.4546536,
      "category": "RELIGIOUS",
      "about": "Gemeente de Brandaris. Maaltijd en Meer opent om de veertien dagen op donderdagavond de deuren voor mensen die behoeften hebben aan een maaltijd. Na de maaltijd is er ruimte om gezellig koffie/thee te drinken en elkaar te ontmoeten.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/maaltijd-en-meer.webp",
      "verificationStatus": "VERIFIED"
    },
    {
      "id": "venue-28",
      "name": "De Zusters van Moeder Teresa",
      "address": "'s Gravendijkwal 13, 3021 EA Rotterdam",
      "city": "Rotterdam",
      "lat": 51.9182771,
      "lng": 4.4627243,
      "category": "RELIGIOUS",
      "about": "De zusters van Moeder Teresa bieden maaltijden aan dak- en thuislozen op zondag, dinsdag, woensdag en zaterdag.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/zusters-moeder-teresa.webp",
      "verificationStatus": "VERIFIED"
    },
    {
      "id": "venue-29",
      "name": "Voedselcentrum Isaak & de Schittering - Noord",
      "address": "Jacob Loisstraat 24-30, 3033 RE Rotterdam",
      "city": "Rotterdam",
      "lat": 51.9279584,
      "lng": 4.468916,
      "category": "FOOD_BANK",
      "about": "Dagelijkse uitdeling van brood, groenten en andere levensmiddelen aan mensen die dit nodig hebben. Geen inkomenscriterium zoals bij de reguliere voedselbank.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/voedselcentrum-isaak-de-schittering.webp",
      "verificationStatus": "VERIFIED"
    },
    {
      "id": "venue-30",
      "name": "Voedselcentrum Isaak & de Schittering - Zuid",
      "address": "Vinkenbaan 73, 3075 RM Rotterdam",
      "city": "Rotterdam",
      "lat": 51.8818044,
      "lng": 4.5023542,
      "category": "FOOD_BANK",
      "about": "Dagelijkse uitdeling van brood, groenten en andere levensmiddelen aan mensen die dit nodig hebben. Geen inkomenscriterium zoals bij de reguliere voedselbank.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/voedselcentrum-isaak-de-schittering.webp",
      "verificationStatus": "VERIFIED"
    },
    {
      "id": "venue-31",
      "name": "Voedselcentrum Isaak & de Schittering - Zuid Oost",
      "address": "Kreekplein 8, 3079 AB Rotterdam",
      "city": "Rotterdam",
      "lat": 51.8856581,
      "lng": 4.5366803,
      "category": "FOOD_BANK",
      "about": "Dagelijkse uitdeling van brood, groenten en andere levensmiddelen aan mensen die dit nodig hebben. Geen inkomenscriterium zoals bij de reguliere voedselbank.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/voedselcentrum-isaak-de-schittering.webp",
      "verificationStatus": "VERIFIED"
    },
    {
      "id": "venue-32",
      "name": "Wijkgebouw de Bron",
      "address": "Vondelweg 254, 3031 PW Rotterdam",
      "city": "Rotterdam",
      "lat": 51.9252643,
      "lng": 4.4891247,
      "category": "RELIGIOUS",
      "about": "Wijkgebouw de Bron biedt verschillende activiteiten aan, waaronder gratis lunch en voedselverdeling voor mensen die het nodig hebben.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/wijkgebouw-de-bron.webp",
      "verificationStatus": "VERIFIED"
    },
    {
      "id": "venue-34",
      "name": "Hotspot Hutspot Schieham",
      "address": "Kloosterplaats 6, 3111 EJ Schiedam",
      "city": "Schiedam",
      "lat": 51.9169682,
      "lng": 4.4018648,
      "category": "COMMUNITY",
      "about": "Sociaal restaurant waar gezonde en betaalbare maaltijden worden aangeboden. Voor degenen die dit niet kunnen betalen, worden de maaltijden gratis aangeboden.",
      "logoUrl": "https://raw.githubusercontent.com/rsx247/DAK/main/assets/logos/thumbs/hotspothutspot.webp",
      "verificationStatus": "VERIFIED"
    }
];

export const allEvents: EventData[] = [
    {
      "id": "event-1",
      "title": "Eethuis",
      "description": "Elke maandag tot en met vrijdag is er een Eethuis in de Pauluskerk. Een gezonde, gezamenlijke maaltijd. We serveren een voorgerechtje, een hoofdmaaltijd, een toetje en koffie en thee na afloop.",
      "startTime": new Date("2025-01-01T16:00:00.000Z"),
      "endTime": new Date("2025-01-01T17:30:00.000Z"),
      "venueId": "venue-1",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€1,00 per persoon",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.pauluskerkrotterdam.nl/het-kerkplein/",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          1,
          2,
          3,
          4,
          5
        ]
      }
    },
    {
      "id": "event-6",
      "title": "Inloopontbijt",
      "description": "Begin de dag goed met een gratis en voedzaam ontbijt. Iedereen is welkom.",
      "startTime": new Date("2025-11-05T06:30:00.000Z"),
      "endTime": new Date("2025-11-05T07:30:00.000Z"),
      "venueId": "venue-2",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 3
      }
    },
    {
      "id": "event-9",
      "title": "Samen Eten bij stg. Perla's Vriend",
      "description": "Wekelijks op Dinsdag en Vrijdag gezamenlijk lunchen bij Stichting Perla's Vriend aan de Teldersweg 255 in Schiebroek. Wees van harte welkom om elkaar te ontmoeten voor een gezellige middag van 11:30-14:00 uur. Kosten voor de lunch bedragen € 3,50 per keer. Tevens vindt eenmaal per maand een culturele avond plaats.",
      "startTime": new Date("2025-11-04T10:30:00.000Z"),
      "endTime": new Date("2025-11-04T13:00:00.000Z"),
      "venueId": "venue-5",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€3,50 per keer",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/rotterdam/agenda/22558/samen-eten-bij-stg-perla-s-vriend",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          2,
          5
        ]
      }
    },
    {
      "id": "event-10",
      "title": "Bezorgen & afhalen Eetcafé OMWD",
      "description": "DRIE GANGEN MENU € 4,00 OF 11 STRIPPENKAART € 40,00. VERSE SOEP, HOOFDGERECHT MET EXTRA FRISSE SLA, FRUIT OF TOETJE. DINSDAG EEN HOLLANDSE PRAK EN VRIJDAG EEN BUITENLANDSE GERECHTEN. GRATIS BEZORGEN BINNEN OUD MATHENESSE & HET WITTE DORP. OPHALEN TUSSEN 10:00 & 13:00.",
      "startTime": new Date("2025-11-04T09:00:00.000Z"),
      "endTime": new Date("2025-11-04T12:00:00.000Z"),
      "venueId": "venue-6",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€4,00 per maaltijd of 11 strippenkaart €40,00",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/rotterdam/agenda/4020/eetcafe",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          2,
          5
        ]
      }
    },
    {
      "id": "event-11",
      "title": "Samen Eten Kleyburg",
      "description": "Vindt u het ook gezelliger om samen te eten? Of vindt u het lastig om zelf te koken? Schuif dan bij ons aan! Iedere maandag en donderdag vanaf 16.30 uur bent u van harte welkom en ontvangen wij u graag met een kopje koffie voor een fijn samenzijn. Rond 17.00 uur wordt het eten opgediend. Kosten: € 8,00 per keer, incl. koffie/thee/sap en dessert.",
      "startTime": new Date("2025-11-04T15:30:00.000Z"),
      "endTime": new Date("2025-11-04T18:00:00.000Z"),
      "venueId": "venue-7",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€8,00 per keer, incl. koffie/thee/sap en dessert",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/rotterdam/agenda/15910/samen-eten",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          1,
          4
        ]
      }
    },
    {
      "id": "event-12",
      "title": "Gezellig samen (Schiebroek)",
      "description": "Gezellig samen' is een fijne middag met andere senioren uit de wijk. We beginnen als de 'R' in de maand is de middag met een lekkere kom soep als lunch. Daarna gaan we met elkaar aan de slag om fit en vitaal te blijven. Dit doen we met een beweegactiviteit vanaf de stoel of een gezamenlijke wandeling door de wijk. Natuurlijk is er ook alle tijd om gezellig met elkaar bij te praten onder het genot van een kop koffie/thee.",
      "startTime": new Date("2025-11-05T13:00:00.000Z"),
      "endTime": new Date("2025-11-05T15:30:00.000Z"),
      "venueId": "venue-7",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€1,50 (inclusief soeplunch)",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/rotterdam/agenda/21837/gezellig-samen",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 3
      }
    },
    {
      "id": "event-13",
      "title": "aanschuifmaaltijden",
      "description": "Gezellig samen eten.",
      "startTime": new Date("2025-11-05T16:30:00.000Z"),
      "endTime": new Date("2025-11-05T18:00:00.000Z"),
      "venueId": "venue-8",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€4,00",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/rotterdam/agenda/17405/aanschuifmaaltijden",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 3
      }
    },
    {
      "id": "event-14",
      "title": "Wijkrestaurant",
      "description": "Iedere maandag en donderdag een heerlijke maaltijd bereid door koks uit de wijk. Wordt verrast met authentieke gerechten uit alle windstreken, gemaakt door vrouwen uit verschillende landen en culturen. Bij Tafelvanzeven komt alles samen: wereldse smaken, culturen en verhalen. En dat proef je. Bestellen kan tot 1 dag tevoren tot 15.00 uur.",
      "startTime": new Date("2025-11-03T16:00:00.000Z"),
      "endTime": new Date("2025-11-03T18:00:00.000Z"),
      "venueId": "venue-9",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "REGISTRATION",
      "cost": "€4,00",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/rotterdam/agenda/2524/wijkrestaurant",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          1,
          4
        ]
      },
      "registrationDeadline": {
        "daysBefore": 1,
        "time": "15:00"
      },
      "registrationInfo": {
        "type": "URL",
        "value": "https://www.wijkconnect.com/rotterdam/agenda/2524/wijkrestaurant"
      }
    },
    {
      "id": "event-15",
      "title": "samen eten aan de aanschuiftafel",
      "description": "Vindt u het ook fijn om buurtgenoten te leren kennen? Heeft u behoefte aan een goede maaltijd? Meldt u dan aan via het e-mailadres en kom gezellig naar de aanschuiftafel. Iedere zondag zitten we met elkaar in de tuin en eten we een gezonde lunch samen. Maak met elkaar een gezonde lunch en ontmoet je buurtgenoten aan de aanschuiftafel in onze tuin.",
      "startTime": new Date("2025-11-09T11:00:00.000Z"),
      "endTime": new Date("2025-11-09T13:15:00.000Z"),
      "venueId": "venue-10",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€3,00",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/rotterdam/agenda/22518/samen-eten-aan-de-aanschuiftafel",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 0
      }
    },
    {
      "id": "event-16",
      "title": "Samen eten (op locatie)",
      "description": "Samen eten op locatie.",
      "startTime": new Date("2025-11-10T16:00:00.000Z"),
      "endTime": new Date("2025-11-10T18:00:00.000Z"),
      "venueId": "venue-11",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€6,00 (of €2-6 naar draagkracht)",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/rotterdam/agenda/16687/samen-eten-op-locatie",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 1
      }
    },
    {
      "id": "event-17",
      "title": "Buurtmaaltijd Eetclub",
      "description": "Deze activiteit is bedoeld voor bewoners die moeilijk kunnen rondkomen en bewoners die zich eenzaam voelen en die hun sociale contacten willen uitbreiden en nieuwkomers in de wijk.",
      "startTime": new Date("2025-11-10T16:00:00.000Z"),
      "endTime": new Date("2025-11-10T19:00:00.000Z"),
      "venueId": "venue-12",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€4,00",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/rotterdam/agenda/15540/buurtmaaltijd-eetclub",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 1
      }
    },
    {
      "id": "event-18",
      "title": "Lunch",
      "description": "De Lunch in De Erker wordt in samenwerking met JMVR gemaakt. U kunt uit verschillende menu's kiezen: alleen een kopje soep met een broodje, belegde broodjes, diverse soepen, of een gehele lunch die bestaat uit een kopje soep, broodje naar keuze, en melk of jus d'orange. U kunt ook iets van de frituur nemen die kunt u aan de bar bestellen. De prijslijst hangt bij de bar.",
      "startTime": new Date("2025-11-03T11:00:00.000Z"),
      "endTime": new Date("2025-11-03T12:30:00.000Z"),
      "venueId": "venue-13",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Variabel (prijslijst bij de bar)",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/schiedam/agenda/7187/lunch",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          1,
          2,
          3,
          4
        ]
      }
    },
    {
      "id": "event-19",
      "title": "Kookpot de Erker",
      "description": "2x per week (op dinsdag en donderdag) een lekkere maaltijd voor slechts € 7,50. Wil je mee eten meld je dan aan vóór 13.30 bij de Erker op tel.nr 010-4267767. Alle maaltijden zijn voor iedereen toegankelijk.",
      "startTime": new Date("2025-11-04T16:30:00.000Z"),
      "endTime": new Date("2025-11-04T18:00:00.000Z"),
      "venueId": "venue-13",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€7,50",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/schiedam/agenda/7165/maaltijd-in-de-wijk",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          2,
          4
        ]
      }
    },
    {
      "id": "event-21",
      "title": "Resto vanHarte: Buurtrestaurant",
      "description": "Iedere woensdagavond schuiven wij gezamenlijk aan in wijkcentrum Schiedam-Groenoord voor een vers en gezond driegangendiner. Bij ons leer je buurtgenoten en wijkorganisaties kennen. Iedereen is welkom om te komen eten of te helpen als vrijwilliger. Bij Resto VanHarte doet iedereen mee!",
      "startTime": new Date("2025-11-05T17:00:00.000Z"),
      "endTime": new Date("2025-11-05T18:30:00.000Z"),
      "venueId": "venue-15",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "REGISTRATION",
      "cost": "€8,00",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/schiedam/agenda/23949/resto-vanharte-buurtrestaurant",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 3
      },
      "registrationDeadline": {
        "daysBefore": 1,
        "time": "17:00"
      },
      "registrationInfo": {
        "type": "URL",
        "value": "https://www.restovanharte.nl/resto/schiedam-groenoord/"
      }
    },
    {
      "id": "event-22",
      "title": "Taverne de Schranserij",
      "description": "Taverne de Schranserij kookt elke donderdag verse maaltijden voor wijkbewoners.",
      "startTime": new Date("2025-11-06T15:45:00.000Z"),
      "endTime": new Date("2025-11-06T18:00:00.000Z"),
      "venueId": "venue-16",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€6,00",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/schiedam/agenda/8039/taverne-de-schanserij",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 4
      }
    },
    {
      "id": "event-23",
      "title": "Eetcafé Dreesplein",
      "description": "Eetcafé Dreesplein is een fijne plek om elkaar te ontmoeten en gezellig met elkaar te eten. Elke donderdagavond koken Winette en Rinus een gezonde maaltijd in het Wijkhuis Dreesplein. Voor €5,- per week krijgen de deelnemers een voorgerecht, hoofdgerecht en een toetje voorgeschoteld.",
      "startTime": new Date("2025-11-06T16:00:00.000Z"),
      "endTime": new Date("2025-11-06T18:30:00.000Z"),
      "venueId": "venue-17",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€5,00 per persoon",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/schiedam/agenda/10926/eetcaf-dreesplein",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 4
      }
    },
    {
      "id": "event-24",
      "title": "Kookclub De Hollandse Pot",
      "description": "De gezelligste kookclub voor alleenstaande senioren! Eerst drinken we gezellig een kop koffie of thee. Daarna bereiden we met elkaar een maaltijd en gaan we aan tafel. Natuurlijk is er ook tijd voor een spelletje en een leuk gesprek.",
      "startTime": new Date("2025-11-08T13:00:00.000Z"),
      "endTime": new Date("2025-11-08T17:00:00.000Z"),
      "venueId": "venue-17",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€5,00",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/schiedam/agenda/24004/kookclub-de-hollandse-pot",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 6
      }
    },
    {
      "id": "event-25",
      "title": "Gratis lunch",
      "description": "Elke maandagmiddag kun je een gratis tosti + kopje soep halen bij de inloop op het Spinhuispad.\n\nJe kunt je inschrijven bij de keuken als je hier gebruik van wilt maken.",
      "startTime": new Date("2025-11-10T11:00:00.000Z"),
      "endTime": new Date("2025-11-10T12:00:00.000Z"),
      "venueId": "venue-18",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkconnect.com/schiedam/agenda/20566/inloop-spinhuispad-gratis-lunch",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          1
        ]
      }
    },
    {
      "id": "event-26",
      "title": "BuurtBuik Rotterdam West - Gratis maaltijd",
      "description": "Gratis maaltijd gemaakt van gered voedsel. Iedereen is welkom, geen reservering nodig.",
      "startTime": new Date("2025-11-06T17:30:00.000Z"),
      "endTime": new Date("2025-11-06T19:00:00.000Z"),
      "venueId": "venue-19",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://buurtbuik.nl/rotterdam-west/",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          4
        ]
      }
    },
    {
      "id": "event-27",
      "title": "BuurtBuik Rotterdam Zuid - Gratis maaltijd",
      "description": "Gratis maaltijd gemaakt van gered voedsel. Iedereen is welkom, geen reservering nodig.",
      "startTime": new Date("2025-11-05T17:30:00.000Z"),
      "endTime": new Date("2025-11-05T19:00:00.000Z"),
      "venueId": "venue-20",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://buurtbuik.nl/rotterdam/",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          3
        ]
      }
    },
    {
      "id": "event-28",
      "title": "Wijkrestaurant Bij de Provenier",
      "description": "De Gaarkeuken kookt meerdere dagen in de week voor een aantal wijkrestaurants in Rotterdam. In deze wijkrestaurants zijn bewoners vanuit de wijk van harte welkom om met elkaar een verse, warme maaltijd te gebruiken. Bijdrage is naar draagkracht. De twee-gangenmaaltijden kosten € 5,00 per persoon. Voor wie het lastig is om te betalen voor het eten, is op doorverwijzing van het wijkteam welkom om aan te schuiven en mee te eten. Locatie: Bij de Provenier.",
      "startTime": new Date("2025-11-04T16:00:00.000Z"),
      "endTime": new Date("2025-11-04T17:00:00.000Z"),
      "venueId": "venue-21",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€5,00 (bijdrage naar draagkracht mogelijk)",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://gaarkeuken.nl/eet-gezellig-mee/",
      "recurrence": {
        "frequency": "WEEKLY",
         "daysOfWeek": [
          1,
          2,
          3,
          4,
          5
        ]
      }
    },
    {
      "id": "event-29",
      "title": "Wijkrestaurant Onder de Oranjeboom",
      "description": "De Gaarkeuken kookt meerdere dagen in de week voor een aantal wijkrestaurants in Rotterdam. In deze wijkrestaurants zijn bewoners vanuit de wijk van harte welkom om met elkaar een verse, warme maaltijd te gebruiken. Bijdrage is naar draagkracht. De twee-gangenmaaltijden kosten € 5,00 per persoon. Voor wie het lastig is om te betalen voor het eten, is op doorverwijzing van het wijkteam welkom om aan te schuiven en mee te eten. Locatie: Onder de Oranjeboom.",
      "startTime": new Date("2025-11-04T16:45:00.000Z"),
      "endTime": new Date("2025-11-04T18:00:00.000Z"),
      "venueId": "venue-22",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€5,00 (bijdrage naar draagkracht mogelijk)",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://gaarkeuken.nl/eet-gezellig-mee/",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          1,
          2,
          3,
          4,
          5
        ]
      }
    },
    {
      "id": "event-30",
      "title": "Wijkrestaurant Dorpsveld",
      "description": "De Gaarkeuken kookt meerdere dagen in de week voor een aantal wijkrestaurants in Rotterdam. In deze wijkrestaurants zijn bewoners vanuit de wijk van harte welkom om met elkaar een verse, warme maaltijd te gebruiken. Bijdrage is naar draagkracht. De twee-gangenmaaltijden kosten € 5,00 per persoon. Voor wie het lastig is om te betalen voor het eten, is op doorverwijzing van het wijkteam welkom om aan te schuiven en mee te eten. Locatie: Dorpsveld.",
      "startTime": new Date("2025-11-07T16:00:00.000Z"),
      "endTime": new Date("2025-11-07T18:00:00.000Z"),
      "venueId": "venue-23",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€5,00 (bijdrage naar draagkracht mogelijk)",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://gaarkeuken.nl/eet-gezellig-mee/",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          5
        ]
      }
    },
    {
      "id": "event-31",
      "title": "Wijkrestaurant Dijkveld",
      "description": "De Gaarkeuken kookt meerdere dagen in de week voor een aantal wijkrestaurants in Rotterdam. In deze wijkrestaurants zijn bewoners vanuit de wijk van harte welkom om met elkaar een verse, warme maaltijd te gebruiken. Bijdrage is naar draagkracht. De twee-gangenmaaltijden kosten € 5,00 per persoon. Voor wie het lastig is om te betalen voor het eten, is op doorverwijzing van het wijkteam welkom om aan te schuiven en mee te eten. Locatie: Dijkveld.",
      "startTime": new Date("2025-11-06T12:00:00.000Z"),
      "endTime": new Date("2025-11-06T14:00:00.000Z"),
      "venueId": "venue-24",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "€5,00 (bijdrage naar draagkracht mogelijk)",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://gaarkeuken.nl/eet-gezellig-mee/",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          4
        ]
      }
    },
    {
      "id": "event-32",
      "title": "Maaltijdavond",
      "description": "Elke vrijdagavond serveren we een afwisselend driegangen menu voor maar 4,00 euro. Kinderen tot 12 jaar eten mee voor €2,50. Inloop vanaf 16.45 uur, aanvang maaltijd om 17.30 uur.",
      "startTime": new Date("2025-11-07T16:30:00.000Z"),
      "endTime": new Date("2025-11-07T18:00:00.000Z"),
      "venueId": "venue-25",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "REGISTRATION",
      "registrationDeadline": {
        "daysBefore": 2,
        "time": "11:00"
      },
      "cost": "€4,00",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.indegouwstraat.nl/activiteiten/maaltijdavond/",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 5
      },
      "registrationInfo": {
        "type": "PHONE",
        "value": "010-4859737",
        "notes": "Aanmelden kan tot woensdag 11:00 uur."
      }
    },
    {
      "id": "event-33",
      "title": "Food For Life Rotterdam",
      "description": "Op deze dag kunt u een overheerlijke 100% plantaardig-vegan maaltijd GRATIS ophalen.",
      "startTime": new Date("2025-11-13T11:00:00.000Z"),
      "endTime": new Date("2025-11-13T17:00:00.000Z"),
      "venueId": "venue-26",
      "foodType": "MEALS",
      "dietaryTags": [
        "vegan"
      ],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.audaryadhaamtemple.nl/2025/10/food-for-life-donderdag-20-januari-a-s/",
      "recurrence": {
        "frequency": "NONE"
      }
    },
    {
      "id": "event-34",
      "title": "Maaltijd en Meer",
      "description": "We openen om de veertien dagen op donderdagavond de deuren voor een maaltijd. Inloop vanaf 17:30 uur, aanvang maaltijd 18:00-19:30 uur.",
      "startTime": new Date("2025-11-06T17:00:00.000Z"),
      "endTime": new Date("2025-11-06T18:30:00.000Z"),
      "venueId": "venue-27",
      "foodType": "MEALS",
      "dietaryTags": [
        "vegetarian"
      ],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "http://www.maaltijdenmeer.nl/kom-langs.html",
      "recurrence": {
        "frequency": "BIWEEKLY",
        "dayOfWeek": 4
      }
    },
    {
      "id": "event-35",
      "title": "Maaltijden voor dak- en thuislozen",
      "description": "De zusters van Moeder Teresa bieden maaltijden aan dak- en thuislozen op zondag, dinsdag, woensdag en zaterdag.",
      "startTime": new Date("2025-01-01T13:30:00.000Z"),
      "endTime": new Date("2025-01-01T15:00:00.000Z"),
      "venueId": "venue-28",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.bisdomrotterdam.nl/nieuws/algemeen-nieuws/als-we-onze-medemens-in-nood-dienen-we-jezus",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          0,
          2,
          3,
          6
        ]
      }
    },
    {
      "id": "event-36",
      "title": "Voedseluitdeling",
      "description": "Dagelijkse uitdeling van brood, groenten en andere levensmiddelen aan mensen die dit nodig hebben. Geen inkomenscriterium zoals bij de reguliere voedselbank.",
      "startTime": new Date("2025-11-03T08:30:00.000Z"),
      "endTime": new Date("2025-11-03T19:00:00.000Z"),
      "venueId": "venue-29",
      "foodType": "PACKAGES",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://stichtingisaakendeschittering.nl/",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          1,
          2,
          3,
          4,
          5,
          6
        ]
      }
    },
    {
      "id": "event-37",
      "title": "Voedseluitdeling",
      "description": "Dagelijkse uitdeling van brood, groenten en andere levensmiddelen aan mensen die dit nodig hebben. Geen inkomenscriterium zoals bij de reguliere voedselbank.",
      "startTime": new Date("2025-11-03T08:30:00.000Z"),
      "endTime": new Date("2025-11-03T19:00:00.000Z"),
      "venueId": "venue-30",
      "foodType": "PACKAGES",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://stichtingisaakendeschittering.nl/",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          1,
          2,
          3,
          4,
          5,
          6
        ]
      }
    },
    {
      "id": "event-38",
      "title": "Voedseluitdeling",
      "description": "Dagelijkse uitdeling van brood, groenten en andere levensmiddelen aan mensen die dit nodig hebben. Geen inkomenscriterium zoals bij de reguliere voedselbank.",
      "startTime": new Date("2025-11-03T08:30:00.000Z"),
      "endTime": new Date("2025-11-03T19:00:00.000Z"),
      "venueId": "venue-31",
      "foodType": "PACKAGES",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://stichtingisaakendeschittering.nl/",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          1,
          2,
          3,
          4,
          5,
          6
        ]
      }
    },
    {
      "id": "event-39",
      "title": "Voedseluitdeling (zondag)",
      "description": "Dagelijkse uitdeling van brood, groenten en andere levensmiddelen aan mensen die dit nodig hebben. Geen inkomenscriterium zoals bij de reguliere voedselbank. Op zondag van 14:00-20:00 uur.",
      "startTime": new Date("2025-11-09T13:00:00.000Z"),
      "endTime": new Date("2025-11-09T19:00:00.000Z"),
      "venueId": "venue-29",
      "foodType": "PACKAGES",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://stichtingisaakendeschittering.nl/",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 0
      }
    },
    {
      "id": "event-40",
      "title": "Voedseluitdeling (zondag)",
      "description": "Dagelijkse uitdeling van brood, groenten en andere levensmiddelen aan mensen die dit nodig hebben. Geen inkomenscriterium zoals bij de reguliere voedselbank. Op zondag van 14:00-20:00 uur.",
      "startTime": new Date("2025-11-09T13:00:00.000Z"),
      "endTime": new Date("2025-11-09T19:00:00.000Z"),
      "venueId": "venue-30",
      "foodType": "PACKAGES",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://stichtingisaakendeschittering.nl/",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 0
      }
    },
    {
      "id": "event-41",
      "title": "Voedseluitdeling (zondag)",
      "description": "Dagelijkse uitdeling van brood, groenten en andere levensmiddelen aan mensen die dit nodig hebben. Geen inkomenscriterium zoals bij de reguliere voedselbank. Op zondag van 14:00-20:00 uur.",
      "startTime": new Date("2025-11-09T13:00:00.000Z"),
      "endTime": new Date("2025-11-09T19:00:00.000Z"),
      "venueId": "venue-31",
      "foodType": "PACKAGES",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://stichtingisaakendeschittering.nl/",
      "recurrence": {
        "frequency": "WEEKLY",
        "dayOfWeek": 0
      }
    },
    {
      "id": "event-42",
      "title": "Gratis lunch",
      "description": "Gratis lunch voor iedereen die het nodig heeft.",
      "startTime": new Date("2025-11-03T11:00:00.000Z"),
      "endTime": new Date("2025-11-03T12:00:00.000Z"),
      "venueId": "venue-32",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkgebouwdebron.nl/activiteiten",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          1,
          2,
          5
        ]
      }
    },
    {
      "id": "event-43",
      "title": "Voedselverdeling",
      "description": "Voedselverdeling om de week op vrijdag. Aanmelden verplicht.",
      "startTime": new Date("2025-11-07T15:00:00.000Z"),
      "endTime": new Date("2025-11-07T16:00:00.000Z"),
      "venueId": "venue-32",
      "foodType": "PACKAGES",
      "dietaryTags": [],
      "accessLevel": "REGISTRATION",
      "cost": "Gratis",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://www.wijkgebouwdebron.nl/activiteiten",
      "recurrence": {
        "frequency": "BIWEEKLY",
        "dayOfWeek": 5
      },
      "registrationInfo": {
        "type": "EMAIL",
        "value": "aanmelden@debron.nl"
      }
    },
    {
      "id": "event-44",
      "title": "Gratis maaltijd - Walk-in",
      "description": "Sociaal restaurant waar gezonde en betaalbare maaltijden worden aangeboden. Voor degenen die dit niet kunnen betalen, worden de maaltijden gratis aangeboden. Je kunt tijdens openingstijden gratis binnenlopen voor een maaltijd.",
      "startTime": new Date("2025-11-04T12:00:00.000Z"),
      "endTime": new Date("2025-11-04T20:00:00.000Z"),
      "venueId": "venue-34",
      "foodType": "MEALS",
      "dietaryTags": [],
      "accessLevel": "WALK_IN",
      "cost": "Gratis (bijdrage naar draagkracht mogelijk)",
      "verificationStatus": "VERIFIED",
      "sourceUrl": "https://hotspothutspot.nl/schieham/",
      "recurrence": {
        "frequency": "WEEKLY",
        "daysOfWeek": [
          2,
          3,
          4,
          5,
          6
        ]
      }
    }
];
