# 📊 Data Master Files

## 🎯 **MASTER FILE**

**`FOOD_EVENTS_MASTER.xlsx`** - This is the **single source of truth** for all food event data.

- Edit this Excel file to add/update food events
- Contains all metadata fields for events and venues
- This file feeds into the application code

---

## 📁 **File Structure**

```
data-master/
├── FOOD_EVENTS_MASTER.xlsx     ← MASTER FILE (edit this!)
├── FOOD_EVENTS_MASTER.csv       ← CSV backup of Excel
└── README.md                    ← This file
```

**Source files** (generated from master):
- `../src/data/events.ts` - TypeScript events data (imported by app)
- `../src/data/venues.ts` - TypeScript venues data (imported by app)

---

## 🔄 **Workflow**

1. **Edit**: Open `FOOD_EVENTS_MASTER.xlsx` in Excel
2. **Add/Update**: Modify events and venues
3. **Sync**: Run conversion script to update TypeScript files (TODO: create sync script)
4. **Deploy**: TypeScript files are imported by the React app

---

## 📋 **Current Status**

- **Total Events**: 5
- **Rotterdam**: 5 events
- **Schiedam**: 0 events  
- **Vlaardingen**: 0 events

---

## 📝 **Notes**

- All events must have a corresponding venue
- GPS coordinates (lat/lng) are required
- Verification status should be updated regularly
- Last verified date tracks data freshness

