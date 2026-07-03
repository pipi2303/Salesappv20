import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Saya AI Assistant Anda. Bagaimana saya bisa membantu monitoring sales Anda hari ini?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const aiResponses: Record<string, string> = {
    'sales': 'Total penjualan bulan ini adalah Rp 845.2 juta dengan pertumbuhan 23.5% dari bulan lalu.',
    'lead': 'Anda memiliki 45 leads aktif. 12 di antaranya hot leads yang perlu ditindaklanjuti segera.',
    'top': 'Top performer bulan ini adalah Budi Santoso dengan total sales Rp 185 juta.',
    'demo': 'Anda memiliki 5 demo terjadwal minggu ini. 2 di antaranya besok.',
    'produk': 'Produk terlaris adalah Enterprise Plan dengan 23 penjualan bulan ini.',
    'kontrak': 'Ada 8 kontrak yang pending approval dan 3 kontrak yang akan expired minggu ini.',
    'tim': 'Tim sales Anda terdiri dari 12 orang dengan rata-rata achievement 87.5%.'
  };

  const getAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    for (const [key, response] of Object.entries(aiResponses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    
    return 'Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang sales, lead, tim, demo, produk, atau kontrak.';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(input),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 500);

    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[#013E37] hover:bg-[#025C52] z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-[#013E37] rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-white" />
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-gray-200">Online - Siap membantu</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-[#013E37] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanyakan sesuatu..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" className="bg-[#013E37] hover:bg-[#025C52]">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}