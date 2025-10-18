import { Card } from '@/components/ui/card';

export default function DirectMessage() {
  return (
    <div className="h-full flex items-center justify-center bg-background">
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">💬</div>
        <h2 className="text-xl font-semibold mb-2">Direct Message (DM)</h2>
        <p className="text-muted-foreground mb-4">No private chats yet</p>
        <p className="text-sm text-muted-foreground">Join communities created by other users to see them here</p>
      </Card>
    </div>
  );
}
