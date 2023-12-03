'use client';

import { Loader2, Trash } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';

export const DeleteButton = ({ fileId }: { fileId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const utils = trpc.useUtils();
  const {
    data,
    mutate: deleteFile,
    isLoading,
  } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button size='sm' className='w-full' variant='destructive'>
          <Trash className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete your PDF?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={() => deleteFile({ id: fileId })}
          >
            {isLoading ? (
              <Loader2 className='animate-spin w-8 h-8' />
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
