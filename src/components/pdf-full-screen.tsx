import { FC, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Expand, Loader2 } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';

interface PDFRendererProps {
  url: string;
}

export const PDFFullScreen: FC<PDFRendererProps> = ({ url }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { width, ref } = useResizeDetector();

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && setIsOpen(v)}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button aria-label='fullscreen' variant='ghost'>
          <Expand className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-7xl w-full'>
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)] mt-6'>
          <div ref={ref}>
            <Document
              loading={
                <div className='flex justify-center'>
                  <Loader2 className='my-24 h-6 w-6 animate-spin' />
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
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
              {new Array(numPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  pageNumber={i + 1}
                  width={width ? width : 1}
                  className='mb-4'
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};
