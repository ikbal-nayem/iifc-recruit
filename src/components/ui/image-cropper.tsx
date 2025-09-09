
'use client';

import * as React from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageCropperProps {
  imageSrc: string | null;
  onCropComplete: (croppedImage: Blob) => void;
  onClose: () => void;
}

export function ImageCropper({ imageSrc, onCropComplete, onClose }: ImageCropperProps) {
  const { toast } = useToast();
  const [crop, setCrop] = React.useState<Crop>();
  const imgRef = React.useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }

  async function handleCrop() {
    if (!imgRef.current || !crop || !crop.width || !crop.height) {
      toast({
          title: 'Error',
          description: 'Invalid crop selection.',
          variant: 'destructive',
      });
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast({
        title: 'Error',
        description: 'Could not process the image.',
        variant: 'destructive',
      });
      return;
    }

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );
    
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        } else {
            toast({
                title: 'Error',
                description: 'Failed to create cropped image.',
                variant: 'destructive',
            });
        }
      },
      'image/png',
      1
    );
  }

  return (
    <Dialog open={!!imageSrc} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Your Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
            {imageSrc && (
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    aspect={1}
                >
                    <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} alt="Crop preview"/>
                </ReactCrop>
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>Crop & Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
