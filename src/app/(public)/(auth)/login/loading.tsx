import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function LoginLoading() {
  return (
    <Card className="glassmorphism">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Image src="/iifc-logo.png" alt="IIFC Logo" width={48} height={48} className="h-12 w-auto" />
        </div>
        <Skeleton className="h-9 w-48 mx-auto" /> {/* Title */}
        <Skeleton className="h-5 w-64 mx-auto mt-2" /> {/* Description */}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-20" /> {/* Label */}
              <Skeleton className="h-5 w-28" /> {/* Forgot password link */}
            </div>
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
          {/* Submit Button */}
          <Skeleton className="h-11 w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="text-center w-full">
          <Skeleton className="h-5 w-64 mx-auto" /> {/* Sign up text */}
        </div>
      </CardFooter>
    </Card>
  );
}