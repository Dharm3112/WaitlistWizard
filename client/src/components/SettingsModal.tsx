import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { X, Settings as SettingsIcon, User, Bell, Upload, Image as ImageIcon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'account' | 'profile' | 'notifications'>('general');
  
  const [settings, setSettings] = useState({
    deleteConfirmation: true,
    enterKeyBehavior: false,
    messageNotifications: true,
    soundNotifications: true,
    roomInvitations: true,
    directMessages: true,
  });

  const tabs = [
    { id: 'general' as const, label: 'General', icon: SettingsIcon },
    { id: 'account' as const, label: 'Account', icon: User },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-popover">
        <div className="flex h-[600px]">
          {/* Left Sidebar */}
          <div className="w-64 bg-card border-r border-border p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Settings</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">General</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">Post Delete Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        Show confirmation dialog when deleting posts. Disable to delete posts instantly.
                      </p>
                    </div>
                    <Switch
                      checked={settings.deleteConfirmation}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, deleteConfirmation: checked })
                      }
                    />
                    <span className="ml-2 text-sm text-muted-foreground">
                      {settings.deleteConfirmation ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">Enter Key Behavior</h4>
                      <p className="text-sm text-muted-foreground">
                        New Line Mode: Enter creates new line. Ctrl+Enter to send
                      </p>
                    </div>
                    <Switch
                      checked={settings.enterKeyBehavior}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, enterKeyBehavior: checked })
                      }
                    />
                    <span className="ml-2 text-sm text-muted-foreground">
                      {settings.enterKeyBehavior ? 'New Line Mode' : 'Send Mode'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Account</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Profile Icon</h4>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-3xl font-bold text-primary-foreground">
                        A
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload a new profile icon (max 50MB)
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Supported formats: JPEG, PNG, GIF, WebP
                        </p>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium mb-1">Choose Image or Drag & Drop</p>
                          <p className="text-xs text-muted-foreground">Click to browse or drag your image here</p>
                        </div>
                        <Button variant="outline" className="mt-3 w-full">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Choose GIF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Profile</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <p className="text-sm text-muted-foreground mb-2">Tell others about yourself</p>
                    <Textarea
                      placeholder="Write a short bio about yourself..."
                      className="min-h-[120px] resize-none"
                    />
                    <div className="text-xs text-muted-foreground mt-1 text-right">0/500</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Interests</label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Share your hobbies, interests, or topics you enjoy
                    </p>
                    <Input
                      placeholder="e.g., Photography, Gaming, Music, Travel, Technology..."
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">Message Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you receive new messages
                      </p>
                    </div>
                    <Switch
                      checked={settings.messageNotifications}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, messageNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">Sound Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Play sound when receiving notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.soundNotifications}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, soundNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">Room Invitations</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified when invited to private rooms
                      </p>
                    </div>
                    <Switch
                      checked={settings.roomInvitations}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, roomInvitations: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">Direct Messages</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified for direct messages
                      </p>
                    </div>
                    <Switch
                      checked={settings.directMessages}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, directMessages: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-2 mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
