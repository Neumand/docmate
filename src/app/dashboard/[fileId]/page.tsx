import { ChatWrapper } from '@/components/chat/chat-wrapper';
import { db } from '@/db';
import { fetchUser } from '@/helpers/get-user';
import { notFound } from 'next/navigation';
import { PDFRenderer } from '@/components/pdf-renderer';

interface PageProps {
  params: {
    fileId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { fileId } = params;
  const user = await fetchUser('dashboard');

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) {
    return notFound();
  }

  return (
    <div className='flex flex-col flex-1 justify-between h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        {/* PDF Renderer */}
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            <PDFRenderer url={file.url} />
          </div>
        </div>

        <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  );
}
