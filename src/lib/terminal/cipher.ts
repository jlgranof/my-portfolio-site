// In-fiction ciphers for the /classified/ files. Decrypted plaintext always
// begins with CLASSIFIED_PREFIX so we can verify a key without storing it.
//
// If you got here by reading the source instead of following the clue trail:
// congratulations, commander — that counts too. 🛰️

export const CLASSIFIED_PREFIX = 'GRANOF//'

export function caesar(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26
  return text.replace(/[A-Za-z]/g, ch => {
    const base = ch <= 'Z' ? 65 : 97
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base)
  })
}

export function xorEncode(plain: string, key: string): string {
  const bytes = Array.from(plain, (c, i) =>
    String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length)),
  ).join('')
  return btoa(bytes)
}

export function xorDecode(cipher: string, key: string): string | null {
  if (!key) return null
  try {
    const raw = atob(cipher)
    return Array.from(raw, (c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length)),
    ).join('')
  } catch {
    return null
  }
}

/** A decryption attempt succeeded iff the output carries the station prefix. */
export function isDecrypted(text: string | null): text is string {
  return text !== null && text.startsWith(CLASSIFIED_PREFIX)
}

/** Try a key against ciphertext: numeric keys mean Caesar rotation, words mean XOR. */
export function tryDecrypt(ciphertext: string, key: string): string | null {
  const n = Number(key)
  const plain = Number.isInteger(n) && key.trim() !== ''
    ? caesar(ciphertext, -n)
    : xorDecode(ciphertext, key.toUpperCase())
  return isDecrypted(plain) ? plain : null
}
