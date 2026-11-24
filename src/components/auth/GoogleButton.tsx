import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { afterSignIn } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { friendlyFirebaseError } from "@/lib/firebase/errors";

/** Firebase Google sign-in (popup). */
export function GoogleButton({ disabled }: { disabled?: boolean }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);


const onClick = async () => {
  setBusy(true);
  try {
    const [{ GoogleAuthProvider, signInWithPopup }, { firebaseAuth }] = await Promise.all([
      import("firebase/auth"),
      import("@/lib/firebase/client"),
    ]);

    await signInWithPopup(firebaseAuth(), new GoogleAuthProvider());

    const destination = await afterSignIn();

    toast.success("Signed in with Google");
    navigate({ to: destination });
  } catch (e) {
    toast.error(friendlyFirebaseError(e));
  } finally {
    setBusy(false);
  }
};


  return (
    <Button type="button" variant="outline" size="lg" className="w-full" onClick={onClick} disabled={disabled || busy}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6c-.3 1.4-1 2.5-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8Z" />
        <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8C3.9 20.5 7.7 23 12 23Z" />
        <path fill="#FBBC05" d="M5.7 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7.1H2.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.1 4.9l3.6-2.8Z" />
        <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.5 2.1 7.1l3.6 2.8C6.6 7.4 9.1 5.4 12 5.4Z" />
      </svg>
      {busy ? "Connecting…" : "Continue with Google"}
    </Button>
  );
}
