import { Check, File, Loader2, Upload } from 'lucide-react';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Progress } from '../ui/progress';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from '../ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';

export const UploadDropzone = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { startUpload } = useUploadThing('pdfUploader');

  // Poll API unti file is uploaded.
  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/dashboard/${id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  function startSimulatedProgress() {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }

        return prevProgress + 1;
      });
    }, 100);

    return interval;
  }

  async function handleFileDrop(acceptedFiles: File[]) {
    setIsUploading(true);
    const progressInterval = startSimulatedProgress();
    const response = await startUpload(acceptedFiles);

    if (!response) {
      return toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Please try again later',
      });
    }

    const [fileResponse] = response;
    const key = fileResponse.key;

    if (!key) {
      return toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Please try again later',
      });
    }

    clearInterval(progressInterval);
    setUploadProgress(100);
    startPolling({ key });
  }

  return (
    <Dropzone multiple={false} onDrop={handleFileDrop}>
      {({ getInputProps, getRootProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className='border h-64 m-4 border-dashed border-gray-300 rounded-lg'
        >
          <div className='flex items-center justify-center h-full w-full'>
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'
            >
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <Upload className='h-6 w-6 text-slate-600 mb-2' />
                <p className='mb-2 text-sm text-slate-700'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs text-slate-500'>PDF (up to 4MB)</p>
              </div>

              {!!acceptedFiles.length && acceptedFiles[0] && (
                <div className='max-w-xs bg-white flex items-center rounded-md overflow-hidden outline-[1px] outline-slate-200 divide-x divide-slate-200'>
                  <div className='px-3 py-2 h-full grid place-items-center'>
                    <File className='h-4 w-4 text-sky-700' />
                    <div className='px-3 py-2 h-full text-sm truncate'>
                      {acceptedFiles[0].name}
                    </div>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className='w-full mt-4 max-w-xs mx-auto'>
                  <Progress
                    value={uploadProgress}
                    className='h-1 w-full bg-slate-200'
                    indicatorColor={
                      uploadProgress === 100 ? 'bg-green-500' : ''
                    }
                  />
                  {uploadProgress === 100 && (
                    <div className='flex gap-1 items-center justify-center text-sm text-slate-700 text-center pt-2'>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      Redirecting...
                    </div>
                  )}
                </div>
              )}

              <input
                {...getInputProps()}
                type='file'
                id='dropzone-file'
                className='hidden'
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
