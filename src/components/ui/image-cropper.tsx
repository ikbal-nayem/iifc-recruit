
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

// Function to get the cropped image data
function getCroppedImg(image: HTMLImageElement, crop: Crop): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return Promise.reject(new Error('Canvas context is not available.'));
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
    );
    
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/png');
    });
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

    try {
        const croppedImageBlob = await getCroppedImg(imgRef.current, crop);
        onCropComplete(croppedImageBlob);
    } catch (e) {
         toast({
            title: 'Error',
            description: 'Failed to create cropped image.',
            variant: 'destructive',
        });
    }
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
                    minWidth={100}
                    minHeight={100}
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
