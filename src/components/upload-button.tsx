'use client';

import { UploadIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>Example Content</DialogContent>
    </Dialog>
  );
};
