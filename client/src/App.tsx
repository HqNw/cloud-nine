import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/login";
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context";
import DashboardRouter from "@/components/DashboardRouter";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<DashboardRouter />} />
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
