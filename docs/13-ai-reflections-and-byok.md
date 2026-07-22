# Optional AI reflections: BYOK-only release

Yi Path's first AI-assisted release is **bring your own key (BYOK) only**. There is no Yi Path account, shared tester code, owner-funded provider key, proxy, subscription, or background model request.

## Request boundary

The browser connects directly to DeepSeek at `https://api.deepseek.com/chat/completions`. A CORS preflight from the local development origin was verified on 2026-07-23. The production Content Security Policy allows this provider origin and no other model provider.

Every request follows this sequence:

1. The visitor enables the optional AI companion.
2. Yi Path prepares a deterministic source packet.
3. The interface shows the exact endpoint, model, fixed guardrail message, and user/source packet.
4. Nothing is sent until the visitor presses **Send to DeepSeek**.
5. The key is placed only in DeepSeek's `Authorization` header. It is never sent to a Yi Path endpoint.
6. The response is labelled as AI reflection and stored in local IndexedDB with its generation ID, model, content version, and source IDs.

Opening or playing with the cat or dog never creates a network request. AI output cannot modify the received Chinese text or the versioned Yi Path editorial files.

## Key modes

### Session only

The key exists only in React memory for the current page lifetime. Locking the key or reloading the page removes it. It is not written to `localStorage`, IndexedDB, exports, logs, URLs, or analytics.

### Encrypted local save

If the visitor explicitly chooses local save, the browser derives a 256-bit AES-GCM key from a passphrase with PBKDF2-SHA-256, a random 16-byte salt, and 310,000 iterations. The API key is stored only as authenticated ciphertext with a random 12-byte IV. The passphrase is never stored. It must be entered again after reload.

The interface states these limits directly:

- the selected, previewed reading data is sent to DeepSeek;
- the API key is never sent to Yi Path and is sent only to DeepSeek for authentication after an explicit request;
- local encryption does not protect against a malicious browser extension, someone controlling the unlocked device, or active cross-site scripting (XSS).

The JSON backup intentionally excludes API keys, encrypted key envelopes, and saved AI generations. **Clear all local data** deletes saved generations and the encrypted key copy, then locks the in-memory key.

## Source packets

Current-reading packets may include the visitor's question, selected received judgment and moving-line text, selected versioned editorial passages, locale, content version, and stable source IDs. Journal notes are not included.

Monthly packets contain local aggregate counts only: the selected date range, primary-hexagram frequency, moving-line-position frequency, and casting-method frequency. Reading questions and journal notes are explicitly excluded and tested as absent.

## Provider and model configuration

The selectable models are `deepseek-v4-flash` and `deepseek-v4-pro`. Flash is the default. Provider errors are reduced to a safe status in the UI; response bodies, authorization headers, and key material are never logged.

## Future hosted access

Shared tester codes are intentionally out of scope for this release. A future hosted-key design would require a server-side provider key, hashed or HMAC-protected revocable codes, durable per-code budgets, rate limiting, abuse controls, a kill switch, and minimal metadata-only logs. It should not be added to the current static architecture without those controls.
