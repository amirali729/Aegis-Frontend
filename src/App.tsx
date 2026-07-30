import { RouterProvider } from "react-router-dom";

import { AppProviders } from "@/providers/app-providers";
import { BootstrapGate } from "@/app/bootstrap-gate";
import { router } from "@/routes/router";

export default function App() {
  return (
    <AppProviders>
      <BootstrapGate>
        <RouterProvider router={router} />
      </BootstrapGate>
    </AppProviders>
  );
}