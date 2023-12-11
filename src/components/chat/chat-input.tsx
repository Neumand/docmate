import { FC, useContext, KeyboardEvent, useRef } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { ChatContext } from './chat-context';

interface ChatInputProps {
  disabled?: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({ disabled = false }) => {
  const { addMesssage, handleInputChange, isLoading, message } =
    useContext(ChatContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleEnter(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMesssage();
      textareaRef.current?.focus();
    }
  }

  return (
    <div className='absolute bottom-0 left-0 w-full'>
      <form className='mx-2 flex gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
        <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
          <div className='relative flex flex-col w-full flex-grow-0 p-4'>
            <div className='relative'>
              <Textarea
                ref={textareaRef}
                disabled={disabled}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                rows={1}
                maxRows={4}
                autoFocus
                placeholder='Enter your question...'
                className='resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
              />

              <Button
                disabled={isLoading || disabled}
                className='absolute bottom-1.5 right-[8px]'
                aria-label='send message'
                onClick={() => {
                  addMesssage();
                  textareaRef.current?.focus();
                }}
              >
                <Send className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
