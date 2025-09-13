import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Plus, Users } from 'lucide-react';

// Chat Room Constants
const INTERESTS = [
  "Technology", "Business", "Marketing", "Design",
  "Finance", "Healthcare", "Education", "Engineering", 
  "Research", "Sales", "HR", "Legal",
  "Consulting", "Real Estate", "Media", "Arts"
];

interface ChatMessage {
  id: string;
  roomId: string;
  username: string;
  content: string;
  timestamp: number;
}

interface ChatRoom {
  id: string;
  name: string;
  interests: string[];
  messages: ChatMessage[];
  participants: string[];
}

export default function Chat() {
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentRoom?.messages]);

  useEffect(() => {
    // Get username
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      const inputUsername = prompt('Enter your name to join chat:');
      if (inputUsername) {
        localStorage.setItem('username', inputUsername);
        setUsername(inputUsername);
      } else {
        return;
      }
    } else {
      setUsername(storedUsername);
    }

    // Initialize WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    console.log('Connecting to WebSocket:', wsUrl);
    
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.onopen = () => {
      console.log('Connected to chat server');
      newSocket.send(JSON.stringify({ type: 'getRooms' }));
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    newSocket.onclose = () => {
      console.log('Disconnected from chat server');
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    };
    
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'rooms':
        setRooms(data.rooms);
        break;
      case 'message':
        // Update the rooms list
        setRooms(prevRooms =>
          prevRooms.map(room =>
            room.id === data.message.roomId
              ? { ...room, messages: [...room.messages, data.message] }
              : room
          )
        );

        // Update the current room if it's the active one
        if (currentRoom && currentRoom.id === data.message.roomId) {
          setCurrentRoom(prev => prev ? {
            ...prev,
            messages: [...prev.messages, data.message]
          } : null);
        }
        break;
      case 'roomJoined':
        setCurrentRoom(data.room);
        break;
      case 'participantsUpdate':
        if (currentRoom) {
          setCurrentRoom(prev => prev ? {
            ...prev,
            participants: data.participants
          } : null);
        }
        break;
    }
  };

  const joinRoom = (roomId: string) => {
    if (socket && username) {
      socket.send(JSON.stringify({
        type: 'joinRoom',
        roomId,
        username
      }));
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentRoom && socket) {
      socket.send(JSON.stringify({
        type: 'sendMessage',
        content: message
      }));
      setMessage('');
    }
  };

  const createRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() && selectedInterests.length > 0 && socket) {
      socket.send(JSON.stringify({
        type: 'createRoom',
        name: newRoomName,
        interests: selectedInterests
      }));
      
      setNewRoomName('');
      setSelectedInterests([]);
      setIsCreateRoomOpen(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-blue-600">
                <Users className="h-5 sm:h-6 w-5 sm:w-6" />
                <span className="text-lg sm:text-xl font-bold">IntelliCircle Chat</span>
              </div>
            </div>
            {username && (
              <div className="text-xs sm:text-sm text-gray-600">
                Welcome, <span className="font-medium">{username}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]">
        {/* Rooms Sidebar */}
        <div className="lg:col-span-1 lg:block">
          <Card className="h-full flex flex-col">
            <div className="p-3 sm:p-4 border-b">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold">Chat Rooms</h2>
                <Button 
                  size="sm" 
                  onClick={() => setIsCreateRoomOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-2 sm:px-3"
                >
                  <Plus className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">New</span>
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 sm:space-y-2">
              {rooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => joinRoom(room.id)}
                  className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                    currentRoom?.id === room.id 
                      ? 'bg-blue-100 border-blue-300 border' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <h3 className="font-medium text-xs sm:text-sm line-clamp-1">{room.name}</h3>
                  <p className="text-xs text-gray-500">{room.participants?.length || 0} participants</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <div className="p-3 sm:p-4 border-b">
              <h2 className="text-base sm:text-lg font-semibold line-clamp-1">
                {currentRoom ? currentRoom.name : 'Select a Room'}
              </h2>
              {currentRoom && (
                <p className="text-xs sm:text-sm text-gray-500">
                  {currentRoom.participants.length} participants
                </p>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3">
              {currentRoom?.messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                    msg.username === username 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="text-xs opacity-75 mb-1">{msg.username}</div>
                    <div className="text-sm sm:text-base break-words">{msg.content}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {currentRoom && (
              <div className="p-2 sm:p-4 border-t">
                <form onSubmit={sendMessage} className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 px-2 sm:px-3">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
          </Card>
        </div>

        {/* Room Details - Hidden on mobile, shown on lg+ */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="h-full">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Room Details</h3>
            </div>
            <div className="p-4 space-y-4">
              {currentRoom && (
                <>
                  <div>
                    <h4 className="font-medium mb-2">Participants</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {currentRoom.participants.map(participant => (
                        <div key={participant} className="flex items-center space-x-2 text-sm">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                            {participant[0]?.toUpperCase()}
                          </div>
                          <span className="truncate">{participant}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Room Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentRoom.interests.map(interest => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Create Room Modal */}
      {isCreateRoomOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Create New Room</h2>
              <form onSubmit={createRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Room Name</label>
                  <Input
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Enter room name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Select Interests</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {INTERESTS.map(interest => (
                      <label key={interest} className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedInterests.includes(interest)}
                          onChange={() => toggleInterest(interest)}
                          className="rounded"
                        />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateRoomOpen(false);
                      setNewRoomName('');
                      setSelectedInterests([]);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!newRoomName.trim() || selectedInterests.length === 0}
                  >
                    Create Room
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}