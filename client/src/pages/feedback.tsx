import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

export default function Feedback() {
  const [feedbackType, setFeedbackType] = useState('general');
  const [feedback, setFeedback] = useState('');

  return (
    <div className="h-full flex items-center justify-center bg-background/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center">
            <span className="text-xl mr-2">💭</span>
            Submit Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Feedback Type</label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Feedback</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Your Feedback</label>
            <Textarea
              placeholder="Please share your thoughts, suggestions, or report any issues you've encountered..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[150px] resize-none"
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {feedback.length}/1000 characters
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              Submit Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
