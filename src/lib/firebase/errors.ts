/** Turns Firebase error codes into friendly, user-facing messages. */
const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
  "auth/weak-password": "Please choose a stronger password.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error — check your connection and try again.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  "auth/operation-not-allowed": "This sign-in method isn't enabled in Firebase yet.",
  "auth/unauthorized-domain": "This website's domain isn't authorised in Firebase Authentication settings.",
  "auth/user-disabled": "This account has been suspended. Contact support for help.",
  "auth/requires-recent-login": "For security, please log out and log back in, then try again.",
  "permission-denied": "You don't have permission to do that.",
  "functions/permission-denied": "You don't have permission to do that.",
  "functions/unauthenticated": "Please log in again.",
  "functions/not-found": "That service isn't deployed yet. Deploy the Cloud Functions to enable it.",
  "functions/internal": "Something went wrong on our side. Please try again.",
  "functions/resource-exhausted": "Too many requests. Please wait a few minutes and try again.",
  unavailable: "You're offline. Check your connection.",
};

export function friendlyFirebaseError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  // Callable errors carry a human message written by our Cloud Functions — prefer it.
  if (code?.startsWith("functions/") && code !== "functions/internal" && code !== "functions/not-found" && err instanceof Error && err.message && !/^[a-z-]+$/.test(err.message)) {
    return err.message;
  }
  if (code && MESSAGES[code]) return MESSAGES[code];
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}
