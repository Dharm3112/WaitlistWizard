import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Globe } from 'lucide-react';

export default function GlobalChat() {
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
        // Also update the rooms list for participant counts
        setRooms(prevRooms =>
          prevRooms.map(room =>
            room.id === data.roomId
              ? { ...room, participants: data.participants }
              : room
          )
        );

        if (currentRoom && currentRoom.id === data.roomId) {
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
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-xl font-semibold flex items-center">
          <Globe className="h-6 w-6 mr-3" />
          Global Chat
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="text-sm text-muted-foreground">Chat messages will appear here</div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-1"
          />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
