import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Suspense } from "react";
import { router } from "./routes";
import AppWrapper from "./providers/AuthProvider";
import { GlobalLoading } from "./components/GlobalLoading";

function App() {
  return (
    <AppWrapper>
      <Suspense fallback={<GlobalLoading text="Cargando..." />}>
        <RouterProvider router={router} />
      </Suspense>
    </AppWrapper>
  );
}

export default App;
