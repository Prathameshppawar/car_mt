'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

// Validation schema for signup
const SignupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  confirmPassword: z.string().min(8, { message: 'Confirm Password must be at least 8 characters long.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });
  const { toast } = useToast();

  // Form submit handler for signup
  async function onSubmit(data) {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/signup', data);

      // Save the token to localStorage
      const { token } = response.data;
      localStorage.setItem('token', token);

      toast({
        title: 'Signup successful!',
        description: 'Redirecting to dashboard...',
      });

      // Redirect to the dashboard immediately
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast({
          title: 'Signup failed',
          description: 'The email is already in use.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Signup failed',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 opacity-50 z-1"></div>
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-md lg:w-1/2 md:w-3/4 sm:w-11/12 z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormDescription>Your email goes here.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormDescription>Your Password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} />
                  </FormControl>
                  <FormDescription>Confirm your Password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button with Spinner */}
            <Button type="submit" disabled={loading} className="w-full flex justify-center items-center">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Signup'}
            </Button>
          </form>
        </Form>

        {/* Already have an account? Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
