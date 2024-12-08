import { BrowserRouter, Routes, Route } from "react-router";
import { ROUTES } from "./Routes";
import { Home, Documents } from "@/pages";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path={ROUTES.ROOT} />
        <Route element={<Documents />} path={ROUTES.DOCUMENTS} />
      </Routes>
    </BrowserRouter>
  );
}
