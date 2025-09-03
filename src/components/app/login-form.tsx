'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Briefcase,
  GraduationCap,
  LogIn,
  Mail,
  ShieldCheck,
} from 'lucide-react';

import type { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
  role: z.enum(['candidate', 'admin', 'evaluator'], {
    required_error: 'You need to select a role.',
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'candidate',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    console.log(data);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Login Successful',
        description: `Redirecting to ${data.role} dashboard...`,
      });

      // In a real app, you'd get a token and user data here.
      // We'll just redirect based on the selected role.
      router.push(`/${data.role}`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Choose your role and enter your credentials to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select your role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <FormItem>
                        <Label
                          htmlFor="candidate"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <RadioGroupItem
                            value="candidate"
                            id="candidate"
                            className="sr-only"
                          />
                          <Briefcase className="mb-3 h-6 w-6" />
                          Candidate
                        </Label>
                      </FormItem>
                      <FormItem>
                        <Label
                          htmlFor="admin"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <RadioGroupItem
                            value="admin"
                            id="admin"
                            className="sr-only"
                          />
                          <ShieldCheck className="mb-3 h-6 w-6" />
                          Admin
                        </Label>
                      </FormItem>
                      <FormItem>
                        <Label
                          htmlFor="evaluator"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <RadioGroupItem
                            value="evaluator"
                            id="evaluator"
                            className="sr-only"
                          />
                          <GraduationCap className="mb-3 h-6 w-6" />
                          Evaluator
                        </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input placeholder="you@example.com" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                   <FormControl>
                     <Input type="password" placeholder="••••••••" {...field} />
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
