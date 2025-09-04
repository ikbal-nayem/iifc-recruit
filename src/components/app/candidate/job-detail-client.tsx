'use client';

import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function JobDetailClient({ jobTitle }: { jobTitle: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: 'Login Required',
      description: `Please log in to apply for the ${jobTitle} position.`,
      variant: 'destructive',
    });
    router.push('/login');
  };

  return <Button onClick={handleApply}>Apply Now</Button>;
}
