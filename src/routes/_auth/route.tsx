import { Outlet, createFileRoute } from "@tanstack/react-router";

/** Auth pages render their own full-screen split layout (AuthShell). */
export const Route = createFileRoute("/_auth")({
  component: () => <Outlet />,
});
