import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';

export default function Echoes() {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-semibold flex items-center">
          <span className="text-2xl mr-2">👥</span>
          Echoes
        </h2>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border px-4">
          <TabsList className="bg-transparent">
            <TabsTrigger value="timeline" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Saved Posts
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              User Leaderboard
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="timeline" className="m-0">
            <div className="space-y-4">
              {/* Announcement Card */}
              <Card className="p-4 bg-card border-primary/20">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">📢</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">Announcement</h3>
                    <p className="text-sm text-muted-foreground mt-1">This is My First Announcement</p>
                    <p className="text-xs text-muted-foreground mt-2">Updated by Admins • 2/3/2025</p>
                  </div>
                </div>
              </Card>

              {/* Post Composer */}
              <Card className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                    A
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="What's in your mind?"
                      className="w-full bg-muted text-foreground rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">📷</Button>
                        <Button variant="ghost" size="sm">🖼️</Button>
                        <Button variant="ghost" size="sm">😊</Button>
                        <Button variant="ghost" size="sm">GIF</Button>
                      </div>
                      <div className="text-xs text-muted-foreground">0/2000</div>
                    </div>
                    <Button className="mt-2 w-full sm:w-auto bg-primary hover:bg-primary/90">Post</Button>
                  </div>
                </div>
              </Card>

              {/* Example Posts */}
              <Card className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-bold">
                    V
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">Vedyvas</span>
                      <span className="text-xs text-muted-foreground">• 3h ago</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" alt="Post" className="mt-2 rounded-lg w-full" />
                    <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                      <button className="hover:text-foreground">❤️ 0</button>
                      <button className="hover:text-foreground">💬 0</button>
                      <button className="hover:text-foreground">🔗 0</button>
                      <button className="hover:text-foreground">🔖 0</button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="m-0">
            <div className="text-center py-12 text-muted-foreground">
              No saved posts yet
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="m-0">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">User Leaderboard</h3>
                <Button variant="outline" size="sm">Refresh</Button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'betaguest', coins: 17, rank: 1 },
                  { name: 'Jlgz289', coins: 14, rank: 2 },
                  { name: 'Vedyvas', coins: 10, rank: 3 },
                  { name: 'CEO @ BASICALY', coins: 8.7, rank: 4 },
                ].map((user) => (
                  <div key={user.rank} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">{user.rank}.</span>
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{user.coins}</div>
                      <div className="text-xs text-muted-foreground">Total Earned</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trending Hashtags */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Trending Hashtags</h4>
                <div className="space-y-2">
                  {[
                    { tag: '#motivation', posts: 2 },
                    { tag: '#india', posts: 2 },
                    { tag: '#morning', posts: 1 },
                    { tag: '#startup', posts: 1 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">#{idx + 1}</span>
                      <span className="text-primary">{item.tag}</span>
                      <span className="text-muted-foreground">{item.posts} posts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="font-bold text-lg">101</div>
                  <div className="text-xs text-muted-foreground">Total Posts</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="font-bold text-lg">0</div>
                  <div className="text-xs text-muted-foreground">Saved Posts</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="font-bold text-lg">8</div>
                  <div className="text-xs text-muted-foreground">Trending Hashtags</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
