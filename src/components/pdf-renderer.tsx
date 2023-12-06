'use client';

import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from 'lucide-react';
import { FC, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import SimpleBar from 'simplebar-react';
import { PDFFullScreen } from './pdf-full-screen';

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
  const [numPages, setNumPages] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(1);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((val) => Number(val) > 0 && Number(val) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: '1',
    },
    resolver: zodResolver(CustomPageValidator),
  });

  function handlePageSubmit({ page }: TCustomPageValidator) {
    setCurrentPage(Number(page));
    setValue('page', String(page));
  }

  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
      <div className='h-14 w-full border-b border-slate-200 flex items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>
          <Button
            aria-label='previous page'
            variant='ghost'
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue('page', String(currentPage - 1));
            }}
          >
            <ChevronDown className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-1.5'>
            <Input
              className={cn(
                'w-12 h-8',
                errors.page && 'focus-visible:ring-red-500',
              )}
              {...register('page')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className='text-slate-700 text-sm space-x-1'>
              <span>/</span>
              <span>{numPages ?? 'x'}</span>
            </p>
          </div>

          <Button
            aria-label='next page'
            variant='ghost'
            disabled={numPages !== undefined && currentPage === numPages}
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1,
              );
              setValue('page', String(currentPage + 1));
            }}
          >
            <ChevronUp className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='gap-1.5' aria-label='zoom' variant='ghost'>
                <Search className='h-4 w-4' />
                {scale * 100}% <ChevronDown className='h-3 w-3 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(1.25)}>
                125%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(1.75)}>
                175%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(2)}>
                200%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            aria-label='rotate 90 degrees'
            variant='ghost'
            onClick={() => setRotation((prev) => prev + 90)}
          >
            <RotateCw className='h-4 w-4' />
          </Button>

          <PDFFullScreen url={url} />
        </div>
      </div>

      <div className='flex-1 w-full max-h-screen'>
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
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
              noData={<div>oop</div>}
              file={url}
              className='max-h-full'
            >
              {isLoading && renderedScale ? (
                <Page
                  key={`@${renderedScale}`}
                  pageNumber={currentPage}
                  width={width ? width : 1}
                  scale={scale}
                  rotate={rotation}
                />
              ) : (
                <Page
                  key={`@${scale}`}
                  className={cn(isLoading ? 'hidden' : '')}
                  pageNumber={currentPage}
                  width={width ? width : 1}
                  scale={scale}
                  rotate={rotation}
                  loading={
                    <div className='flex justify-center'>
                      <Loader2 className='my-24 h-6 w-6 animate-spin' />
                    </div>
                  }
                  onRenderSuccess={() => setRenderedScale(scale)}
                />
              )}
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};
