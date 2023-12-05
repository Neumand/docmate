'use client';

import { Loader2 } from 'lucide-react';
import { FC } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface PDFRendererProps {
  url: string;
}

export const PDFRenderer: FC<PDFRendererProps> = ({ url }) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
      <div className='h-14 w-full border-b border-slate-200 flex items-center justify-between px-2'>
        <div className='flex items-center gap-[1.5]'>Top Bar</div>
      </div>

      <div className='flex-1 w-full max-h-screen'>
        <div ref={ref}>
          <Document
            loading={
              <div className='flex justify-center'>
                <Loader2 className='my-24 h-6 w-6 animate-spin' />
              </div>
            }
            onLoadError={(e) => {
              toast({
                title: 'Error loading PDF',
                description: 'Please try again later',
                variant: 'destructive',
                content: e.message,
              });
            }}
            file={url}
            className='max-h-full'
          >
            <Page pageNumber={1} width={width ? width : 1} />
          </Document>
        </div>
      </div>
    </div>
  );
};
