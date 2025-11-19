import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";
import SalesAcademy from "./pages/SalesAcademy";
import PostMeeting from "./pages/PostMeeting";
import MeetingPrep from "./pages/MeetingPrep";
import AccountAttack from "./pages/AccountAttack";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/auth/callback"} component={AuthCallback} />
      <Route path={"/sales-academy"} component={SalesAcademy} />
      <Route path={"/post-meeting"} component={PostMeeting} />
      <Route path={"/meeting-prep"} component={MeetingPrep} />
      <Route path={"/account-attack"} component={AccountAttack} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
