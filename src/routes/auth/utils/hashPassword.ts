export async function deriveSalt(email: string) {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(email));
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export async function hashPassword(password: string, salt: string) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: Uint8Array.from(atob(salt), (c) => c.charCodeAt(0)),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return btoa(String.fromCharCode(...new Uint8Array(derivedKey)));
}

export async function verifyPassword(
  password: string,
  email: string,
  storedHash: string
) {
  const salt = await deriveSalt(email);
  const derivedHash = await hashPassword(password, salt);
  return derivedHash === storedHash;
}
