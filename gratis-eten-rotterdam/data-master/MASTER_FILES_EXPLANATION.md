# 🎯 Master Files Explanation

## **WHERE IS THE DATABASE?**

The food events database consists of **THREE files**:

### 1. **MASTER FILE** (Edit this one!)
📄 **`FOOD_EVENTS_MASTER.xlsx`** 
- Location: `gratis-eten-rotterdam/data-master/`
- **This is the file you edit**
- Excel format with all event and venue data
- Contains 24 columns of metadata

### 2. **Source Code Files** (Auto-generated from master)
📄 **`src/data/events.ts`** - Events data for the app
📄 **`src/data/venues.ts`** - Venues data for the app

---

## 🗂️ **Folder Structure**

```
gratis-eten-rotterdam/
├── data-master/              ← DATA WORK HAPPENS HERE
│   ├── FOOD_EVENTS_MASTER.xlsx  ← EDIT THIS FILE
│   ├── FOOD_EVENTS_MASTER.csv
│   └── README.md
│
└── src/
    └── data/                 ← AUTO-GENERATED (from master)
        ├── events.ts
        └── venues.ts
```

---

## ✅ **What Each Folder Does**

| Folder | Purpose | Edit? |
|--------|---------|-------|
| `data-master/` | Master data files | ✅ YES - Edit here |
| `src/data/` | Application source code | ❌ NO - Auto-generated |

---

## 📊 **Current Database Contents**

- **5 food events** in Rotterdam
- **4 venues** (Pauluskerk, Voedselbank, Thuisgekookt, Leger des Heils)
- All events are in Rotterdam (0 in Schiedam/Vlaardingen)

---

## 🔄 **How to Add New Events**

1. Open `FOOD_EVENTS_MASTER.xlsx`
2. Add new row with event data
3. Fill in all required fields (see column headers)
4. Save Excel file
5. Run sync script (TODO: create this) to update TypeScript files
6. App will automatically show new events

---

## ⚠️ **Important**

- **Only edit `FOOD_EVENTS_MASTER.xlsx`**
- Don't edit `events.ts` or `venues.ts` directly
- They are generated from the master file

