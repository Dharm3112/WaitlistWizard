import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Hash } from 'lucide-react';

export default function Communities() {
  const [location] = useLocation();
  
  let title = 'Communities';
  let icon = '🏘️';
  let message = 'No communities yet';
  
  if (location.includes('joined')) {
    title = 'Joined Communities';
    message = '0 rooms';
  } else if (location.includes('explore')) {
    title = 'Explore Community';
    icon = '🔍';
  } else if (location.includes('private')) {
    title = 'Private Community';
    icon = '🔒';
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="text-2xl mr-2">{icon}</span>
          {title}
        </h2>
        <button className="px-4 py-2 bg-muted text-sm rounded-lg hover:bg-muted/80">
          Select
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4"><Hash className="h-12 w-12 mx-auto text-muted-foreground" /></div>
          <h3 className="text-lg font-semibold mb-2">{message}</h3>
          <p className="text-sm text-muted-foreground">
            Join communities created by other users to see them here
          </p>
        </Card>
      </div>
    </div>
  );
}
