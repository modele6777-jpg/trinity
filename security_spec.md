# Security Specification - Lucy Activity History

## 1. Data Invariants
- A user can only read and write their own profile document.
- A user can only read and write their own activity history.
- Activity history documents MUST have a `userId` field that matches the authenticated user ID.
- Activity history documents MUST have a `createdAt` field that matches the server timestamp.
- Certain fields in ‘User’ profile (like `uid`, `email`) are immutable after creation.
- Shared state is readable and writable only by the owner.

## 2. The "Dirty Dozen" Payloads

1. **Identity Spoofing (Create)**: Attempt to create a history entry for another user.
2. **Identity Spoofing (Update)**: Attempt to change the `userId` of an existing history entry.
3. **Resource Poisoning (ID)**: Attempt to use a 2MB string as a document ID.
4. **Resource Poisoning (Field)**: Attempt to inject a 1MB string into the `type` field of a history entry.
5. **State Shortcutting**: Attempt to update a history entry's `createdAt` to a future date.
6. **Cross-User Listing**: Attempt to query all history entries without a `userId` filter (expecting it to leak other users' data, but rules should block if they don't filter).
7. **Cross-User Listing (Targeted)**: Attempt to query another user's history collection.
8. **Unauthorized Profile Update**: User A attempts to update User B's profile.
9. **Shadow Field Injection**: Attempt to add an `isAdmin: true` field to a User profile.
10. **Type Mismatch**: Attempt to write a number into the `text` field of a history entry.
11. **Malicious Path Injection**: Attempt to write to `users/7glieoXSoXfuNyykYwogoKZwQJ93/history/../../../system_config`.
12. **PII Leak**: An unauthenticated user attempts to read a user's `email`.

## 3. Conflict Report

| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
| :--- | :--- | :--- | :--- |
| /users | Blocked by UID check | N/A | Blocked by isValidUser |
| /users/{id}/history | Blocked by userId check | Blocked by Timestamp check | Blocked by isValidActivity |
| /sharedState | Blocked by UID check | N/A | Blocked by isValidSharedState |
