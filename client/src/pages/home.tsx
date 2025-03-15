import { Button } from "@/components/ui/button";
import { WaitlistForm } from "@/components/waitlist-form";
import { Card, CardContent } from "@/components/ui/card";
import { MapIcon, Users2Icon, BrainCircuitIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Connect With Local Professionals
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            An AI-powered networking platform that connects you with like-minded professionals in your area. Join our waitlist to be among the first to experience the future of networking.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapIcon className="w-12 h-12 text-primary" />}
              title="Location-Based"
              description="Connect with professionals in your area through smart location-based matching"
            />
            <FeatureCard
              icon={<BrainCircuitIcon className="w-12 h-12 text-primary" />}
              title="AI-Powered Matching"
              description="Our AI algorithm matches you with professionals sharing similar interests and goals"
            />
            <FeatureCard
              icon={<Users2Icon className="w-12 h-12 text-primary" />}
              title="Dynamic Rooms"
              description="Join or create interest-based rooms to network with like-minded professionals"
            />
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Join the Waitlist</h2>
          <WaitlistForm />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6">
      <CardContent className="space-y-4 pt-6">
        <div className="flex justify-center">{icon}</div>
        <h3 className="text-xl font-semibold text-center">{title}</h3>
        <p className="text-muted-foreground text-center">{description}</p>
      </CardContent>
    </Card>
  );
}
