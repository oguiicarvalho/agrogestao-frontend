import React from 'react';

const Chat = () => {
  return (
    <div className="space-y-6" data-testid="chat-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
          <p className="text-gray-600 mt-1">Central de mensagens e comunicação entre usuários.</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white border rounded-lg">
        <p className="text-gray-600">Funcionalidade de chat ainda não implementada — este é um placeholder.</p>
      </div>
    </div>
  );
};

export default Chat;
