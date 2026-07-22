# Settings, local companion, and notebook lock

## Settings spaces

The Settings page is split into two explicit workspaces:

- **Settings** — language, atmosphere, coin and meditation sound, motion, privacy, notebook protection, import/export, and clearing local data.
- **Pet & AI** — the local companion studio and the separate optional DeepSeek BYOK layer.

Each workspace has anchor pills modelled on the Dao learning navigation. A route to `/settings#ai-key-settings` selects **Pet & AI** before scrolling and focusing the DeepSeek section.

## Local companion contract

The cat and dog are usable without AI. `companionEnabled` and `aiEnabled` are independent preferences. Existing users are migrated by copying their earlier combined AI/pet choice into the new companion preference once.

The route-aware behavior table is local and deterministic:

| Context | Quiet behavior |
| --- | --- |
| Home | one silent welcome motion, then idle |
| Result | one silent welcome motion, then idle |
| Casting ritual | sleep |
| Journal and monthly patterns | rest/sleep |
| Settings | remain visible and idle |
| Study and Dao | idle |

Automatic behavior never plays sound. Purrs, chirps, hisses, barks, and happy dog sounds require a direct user action. Every interaction increments a render token so pressing the same animation repeatedly restarts it reliably.

## Encrypted notebook lock

Notebook protection is optional and local. It covers:

- readings and their questions/notes;
- journal entries;
- anchored study notes;
- reading progress and practice sessions;
- saved AI reflections.

When protection is enabled, Yi Path serializes these stores into one versioned notebook payload, encrypts it with AES-256-GCM, and writes the envelope to a dedicated IndexedDB database. The encryption key is derived with PBKDF2-HMAC-SHA-256, a random 16-byte salt, and 310,000 iterations. Every write uses a new 12-byte AES-GCM IV. After the encrypted envelope is safely written, plaintext notebook stores are cleared.

The passphrase and derived key are never persisted. The key exists only in memory while the tab is unlocked. Reloading or choosing **Lock notebook now** requires the passphrase again. A wrong passphrase does not return partial plaintext.

While unlocked, the existing storage API transparently reads and writes the encrypted in-memory notebook, serializing encrypted writes to prevent stale snapshots from winning a race. Export/import continues to work through the same API. Removing protection restores the notebook to the ordinary local IndexedDB stores before deleting the encrypted envelope.

### Recovery and limits

There is no password reset, account, server copy, or recovery key. If the passphrase is forgotten, the only recovery path is explicitly erasing the encrypted notebook.

The lock does not cover visual/audio preferences, an exported JSON/PNG/PDF file, or a separately encrypted BYOK credential. Browser-local encryption also cannot defend against an active same-origin script compromise, malicious browser extension with sufficient access, compromised device session, or screen/keyboard capture.

## Verification

- deterministic unit tests cover the route behavior table;
- crypto tests verify round-trip, ciphertext secrecy, and wrong-passphrase rejection;
- browser checks cover workspace selection, AI deep-link landing, repeated pet actions, protect/lock/wrong-passphrase/unlock/remove, desktop layout, 390 px mobile layout, horizontal overflow, runtime errors, and error overlays.
