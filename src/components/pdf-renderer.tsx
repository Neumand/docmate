import { File } from '@prisma/client';
import { FC } from 'react';

interface PDFRendererProps {
  file: File;
}

export const PDFRenderer: FC<PDFRendererProps> = () => {
  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
      <div className='h-14 w-full border-b border-slate-200 flex items-center justify-between px-2'>
        <div className='flex items-center gap-[1.5]'>Top Bar</div>
      </div>
    </div>
  );
};
