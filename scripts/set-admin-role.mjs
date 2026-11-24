import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const targetEmail = "info@paymenthouse.net";

const rl = createInterface({
  input: stdin,
  output: stdout,
});

try {
  const confirmation = await rl.question(
    `Type PROMOTE ${targetEmail} to confirm: `
  );

  if (confirmation.trim() !== `PROMOTE ${targetEmail}`) {
    console.log("Cancelled. No changes were made.");
    process.exitCode = 1;
  } else {
    initializeApp({
      credential: applicationDefault(),
      projectId: "paymenthouse",
    });

    const auth = getAuth();
    const user = await auth.getUserByEmail(targetEmail);

    const existingClaims = user.customClaims ?? {};

    await auth.setCustomUserClaims(user.uid, {
      ...existingClaims,
      role: "admin",
    });

    console.log(`Successfully assigned admin role to ${targetEmail}.`);
  }
} catch (error) {
  console.error("Could not assign admin role:", error.message);
  process.exitCode = 1;
} finally {
  rl.close();
}