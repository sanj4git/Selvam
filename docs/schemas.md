## Approved Asset Schema (Phase 1)

Asset
 ├── userId       (ObjectId, required)
 ├── assetType    (String, required)
 ├── name         (String, required)
 ├── value        (Number, required)
 ├── createdAt    (Date, auto)
 ├── updatedAt    (Date, auto)

Notes:
- Each asset belongs to exactly one user
- userId comes from JWT middleware (req.user)
- Manual entry only (no market APIs in Phase 1)


