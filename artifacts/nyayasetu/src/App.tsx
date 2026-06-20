import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { VoiceCommand } from "@/components/voice-command";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import RightsExplorer from "@/pages/rights";
import RightsArticle from "@/pages/rights-article";
import Complaints from "@/pages/complaints";
import NewComplaint from "@/pages/complaints-new";
import ComplaintDetail from "@/pages/complaints-detail";
import Documents from "@/pages/documents";
import Journeys from "@/pages/journeys";
import JourneyDetail from "@/pages/journeys-detail";
import Schemes from "@/pages/schemes";
import SchemeDetail from "@/pages/schemes-detail";
import Learning from "@/pages/learning";
import LearningDetail from "@/pages/learning-detail";
import LegalAid from "@/pages/legalaid";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminUsers from "@/pages/admin-users";
import ProtectedRoute from "@/components/protected-route";

setAuthTokenGetter(() => localStorage.getItem("auth_token"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Login} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/rights">
        <ProtectedRoute><RightsExplorer /></ProtectedRoute>
      </Route>
      <Route path="/rights/:id">
        {(params) => <ProtectedRoute><RightsArticle id={parseInt(params.id)} /></ProtectedRoute>}
      </Route>
      <Route path="/complaints/new">
        <ProtectedRoute><NewComplaint /></ProtectedRoute>
      </Route>
      <Route path="/complaints/:id">
        {(params) => <ProtectedRoute><ComplaintDetail id={parseInt(params.id)} /></ProtectedRoute>}
      </Route>
      <Route path="/complaints">
        <ProtectedRoute><Complaints /></ProtectedRoute>
      </Route>
      <Route path="/documents">
        <ProtectedRoute><Documents /></ProtectedRoute>
      </Route>
      <Route path="/journeys/:id">
        {(params) => <ProtectedRoute><JourneyDetail id={parseInt(params.id)} /></ProtectedRoute>}
      </Route>
      <Route path="/journeys">
        <ProtectedRoute><Journeys /></ProtectedRoute>
      </Route>
      <Route path="/schemes/:id">
        {(params) => <ProtectedRoute><SchemeDetail id={parseInt(params.id)} /></ProtectedRoute>}
      </Route>
      <Route path="/schemes">
        <ProtectedRoute><Schemes /></ProtectedRoute>
      </Route>
      <Route path="/learning/bookmarks">
        <ProtectedRoute><Learning bookmarksOnly /></ProtectedRoute>
      </Route>
      <Route path="/learning/:id">
        {(params) => <ProtectedRoute><LearningDetail id={parseInt(params.id)} /></ProtectedRoute>}
      </Route>
      <Route path="/learning">
        <ProtectedRoute><Learning /></ProtectedRoute>
      </Route>
      <Route path="/legalaid">
        <ProtectedRoute><LegalAid /></ProtectedRoute>
      </Route>
      <Route path="/chat">
        <ProtectedRoute><Chat /></ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute><Profile /></ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
            <VoiceCommand />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
