import { Button } from "@/components/ui/button";
import { WaitlistForm } from "@/components/waitlist-form";
import { Card, CardContent } from "@/components/ui/card";
import { MapIcon, Users2Icon, BrainCircuitIcon, MessagesSquareIcon, MapPinIcon, BuildingIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center space-y-6"
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Location-Based Professional Networking
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with professionals in your area through AI-powered rooms. Share ideas, solve problems, and build meaningful connections based on shared interests and location.
            </p>
            <div className="flex justify-center mt-8">
              <Link href="/chat">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  Try Chat Now
                </Button>
              </Link>
            </div>
          </motion.div>
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

      {/* How It Works Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              icon={<BuildingIcon className="w-8 h-8 text-primary" />}
              title="Enter Your Field"
              description="Tell us about your profession and areas of interest"
            />
            <StepCard
              number="2"
              icon={<MapPinIcon className="w-8 h-8 text-primary" />}
              title="Location Detection"
              description="We automatically detect your location to find relevant connections"
            />
            <StepCard
              number="3"
              icon={<MessagesSquareIcon className="w-8 h-8 text-primary" />}
              title="Join Conversations"
              description="Connect in AI-created rooms with professionals in your area"
            />
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Waitlist</h2>
          <p className="text-muted-foreground mb-8">
            Be among the first to experience the future of professional networking.
          </p>
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 h-full">
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-center">{icon}</div>
          <h3 className="text-xl font-semibold text-center">{title}</h3>
          <p className="text-muted-foreground text-center">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StepCard({ number, icon, title, description }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 h-full relative">
        <CardContent className="space-y-4 pt-6">
          <span className="absolute top-4 right-4 text-4xl font-bold text-primary/10">
            {number}
          </span>
          <div className="flex justify-center">{icon}</div>
          <h3 className="text-xl font-semibold text-center">{title}</h3>
          <p className="text-muted-foreground text-center">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}