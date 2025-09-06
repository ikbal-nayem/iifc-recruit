'use client';

import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

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

  return <Button onClick={handleApply}>
    <Send className="mr-2 h-4 w-4" />
    Apply Now
  </Button>;
}
