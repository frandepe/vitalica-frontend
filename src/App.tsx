import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Suspense } from "react";
import { router } from "./routes";
import AppWrapper from "./providers/AuthProvider";

const GlobalLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-muted-foreground text-sm">Cargando...</p>
    </div>
  </div>
);

function App() {
  return (
    <AppWrapper>
      <Suspense fallback={<GlobalLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </AppWrapper>
  );
}

export default App;
