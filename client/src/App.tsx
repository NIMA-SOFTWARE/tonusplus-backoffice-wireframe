import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PilatesProvider } from "@/context/PilatesContext";
import Dashboard from "@/pages/Dashboard";
import ClientMedicalRecords from "@/pages/ClientMedicalRecords";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/client-medical-records/:customerId" component={ClientMedicalRecords} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PilatesProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </PilatesProvider>
    </QueryClientProvider>
  );
}

export default App;
