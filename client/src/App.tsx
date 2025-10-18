import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import Discover from "@/pages/discover";
import Profile from "@/pages/profile";
import Echoes from "@/pages/echoes";
import DirectMessage from "@/pages/dm";
import Feedback from "@/pages/feedback";
import Communities from "@/pages/communities";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/discover" component={Discover} />
        <Route path="/chat" component={Chat} />
        <Route path="/profile" component={Profile} />
        <Route path="/echoes" component={Echoes} />
        <Route path="/dm" component={DirectMessage} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/community/create" component={Communities} />
        <Route path="/community/explore" component={Communities} />
        <Route path="/community/private" component={Communities} />
        <Route path="/community/joined" component={Communities} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
