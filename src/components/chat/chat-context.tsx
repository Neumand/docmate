import { ChangeEvent, FC, createContext, useContext, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { useMutation } from '@tanstack/react-query';

interface StreamResponse {
  addMesssage: () => void;
  message: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

interface ChatContextProviderProps {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContext = createContext<StreamResponse>({
  addMesssage: () => {},
  message: '',
  handleInputChange: () => {},
  isLoading: false,
});

export const ChatContextProvider: FC<ChatContextProviderProps> = ({
  fileId,
  children,
}) => {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.body;
    },
    onError: () =>
      toast({
        title: 'Error Sending Message',
        description: 'Please try again later',
      }),
  });

  return (
    <ChatContext.Provider
      value={{
        addMesssage: () => sendMessage({ message }),
        message,
        handleInputChange(e) {
          console.log('setting message');
          setMessage(e.target.value);
        },
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
