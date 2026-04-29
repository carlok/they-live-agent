export const FIELDS = {
    A: [
        { label: "ESTIMATED AGE", values: ["24", "28", "34", "41", "56"] },
        { label: "BODY TEMP (°C)", values: ["36.5", "36.7", "37.1", "36.9"], mod: -5 },
        { label: "DOMINANT HAND", values: ["LEFT", "RIGHT", "AMBIDEXTROUS"] },
        { label: "ESTIMATED HEIGHT", values: ["165cm", "178cm", "182cm", "159cm"] },
        { label: "FOOTWEAR WEAR", values: ["HEEL-STRIKER", "FOREFOOT", "UNEVEN"] },
        { label: "LAST MEAL (EST.)", values: ["CARB-HEAVY", "FASTING 6H+", "PROTEIN-RICH"] },
        { label: "STRESS INDEX", values: ["LOW", "MODERATE", "ELEVATED", "██████"] },
        { label: "TRANSIT METHOD", values: ["FOOT", "VEHICLE", "UNKNOWN"] },
        { label: "YEARS IN LOC", values: ["<1", "3", "7", "22"] }
    ],
    B: [
        { label: "COVER ID VERSION", values: ["v1.0", "v2.3", "v7.1 (LEGACY)"] },
        { label: "ASSIGNED SECTOR", values: ["SECTOR 4", "SECTOR 11", "UNASSIGNED"] },
        { label: "HIVE NODE PROX.", values: ["NEAR", "REMOTE", "ISOLATED"] },
        { label: "BEHAVIORAL SCRIPT", values: ["STANDARD-CIVILIAN", "COMMUTER-B", "RETAIL-LOOP"] },
        { label: "SIGNAL BLEED", values: ["NONE", "TRACE", "MODERATE", "CRITICAL"], specialMods: {"CRITICAL": 30} },
        { label: "PSYCH. ANCHOR", values: ["FAMILY", "OCCUPATION", "ROUTINE", "NONE"] },
        { label: "INTEGRATION DATE", values: ["2019-03-11", "1987-08-02", "PREDATES RECORDS"], specialMods: {"1987-08-02": 20, "PREDATES RECORDS": 20} },
        { label: "MISSION STATUS", values: ["PASSIVE", "ACTIVE", "DORMANT", "COMPLETED (?)"] },
        { label: "HUMAN FLUENCY", values: ["94%", "71%", "99.2%", "43% — CRITICAL"], specialMods: {"43% — CRITICAL": 25} }
    ],
    C: [
        { label: "FAV. COLOR (REP)", values: ["BEIGE", "NULL", "[SEE ATTACHMENT]"] },
        { label: "BLOOD TYPE", values: ["A+", "O-", "XΩ", "PENDING RECLASS."] },
        { label: "CHILDHOOD PET", values: ["NONE", "DOG", "CLASSIFIED", "N/A (CONSTRUCT)"] },
        { label: "DREAMS FREQ.", values: ["NIGHTLY", "RARELY", "DOES NOT DREAM"], specialMods: {"DOES NOT DREAM": 12} },
        { label: "LAUGH TYPE", values: ["GENUINE", "PERFORMED", "UNKNOWN"] },
        { label: "GRAVITY REL.", values: ["NORMAL", "COMPENSATED", "████████"] },
        { label: "IRONY COMP.", values: ["HIGH", "MEDIUM", "LOW", "SIMULATED"] },
        { label: "LIBRARY CARD", values: ["ACTIVE", "EXPIRED", "NEVER HELD", "ILLEGAL CONCEPT"] },
        { label: "SHADOW CONSIST.", values: ["VERIFIED", "UNVERIFIED", "ANOMALOUS"], specialMods: {"VERIFIED": -10} },
        { label: "CHEESE PREF.", values: ["MODERATE", "INTENSE", "REPULSION", "N/A (NONDAIRY)"] },
        { label: "EYE CONTACT AVG", values: ["2.1s", "3.8s", "0.0s", "14.7s — FLAG"] },
        { label: "CHILDHOOD", values: ["YES", "PARTIALLY", "RETROACTIVELY INSERTED"], specialMods: {"YES": -8} }
    ],
    D: [
        { label: "SCAN AWARENESS", values: ["NO", "PROBABLE", "CONFIRMED — ABORT?"] },
        { label: "FILE ACCESSED", values: ["1 TIME", "847 TIMES", "0 TIMES (INCONSISTENT)"] },
        { label: "AGENT RELIABILITY", values: ["RECALCULATING...", "LIABILITY"] },
        { label: "SIGNAL SOURCE", values: ["VERIFIED", "SPOOFED", "RECURSIVE"] },
        { label: "REC. ACTION", values: ["NEUTRALIZE", "SKIP", "RUN", "OBSERVE ONLY"] },
        { label: "PREV. AGENT NOTE", values: ["[EMPTY]", "\"DO NOT TAP\"", "\"TRUST THIS ONE\"", "\"same as yesterday\""] }
    ]
};
