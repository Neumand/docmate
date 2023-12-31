'use client';

import { trpc } from '@/app/_trpc/client';
import { ChatInput } from './chat-input';
import { Messages } from './messages';
import { FC } from 'react';
import { ChevronLeft, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { ChatContextProvider } from './chat-context';

interface ChatWrapperProps {
  fileId: string;
}

export const ChatWrapper: FC<ChatWrapperProps> = ({ fileId }) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (data) =>
        data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500,
    },
  );

  if (isLoading) {
    return (
      <div className='relative min-h-full bg-slate-50 flex divide-y divide-slate-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-sky-800 animate-spin' />
            <h3 className='font-semibold text-xl'>Loading...</h3>
            <p className='text-slate-500 text-sm'>{`We're preparing your PDF.`}</p>
          </div>
        </div>

        <ChatInput disabled />
      </div>
    );
  }

  if (data?.status === 'PROCESSING') {
    return (
      <div className='relative min-h-full bg-slate-50 flex divide-y divide-slate-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-sky-800 animate-spin' />
            <h3 className='font-semibold text-xl'>Processing PDF...</h3>
            <p className='text-slate-500 text-sm'>{`This won't take long.`}</p>
          </div>
        </div>

        <ChatInput disabled />
      </div>
    );
  }

  if (data?.status === 'FAILED') {
    return (
      <div className='relative min-h-full bg-slate-50 flex divide-y divide-slate-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <XCircle className='h-8 w-8 text-red-500' />
            <h3 className='font-semibold text-xl'>Too many pages in PDF</h3>
            <p className='text-slate-500 text-sm'>
              Your <span className='font-semibold'>free</span> plan supports up
              to 5 pages per PDF
            </p>
            <Link
              href='/dashboard'
              className={buttonVariants({
                variant: 'secondary',
                className: 'mt-4 hover:bg-slate-200',
              })}
            >
              Back
            </Link>
          </div>
        </div>

        <ChatInput disabled />
      </div>
    );
  }

  return (
    <ChatContextProvider fileId={fileId}>
      <div className='relative min-h-full bg-slate-50 flex divde-y divide-slate-200 flex-col justify-between gap-2'>
        <div className='flex-1 justify-between flex flex-col mb-28'>
          <Messages />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};
