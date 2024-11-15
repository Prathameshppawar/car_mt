'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
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

// Validation schema
const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });
  const {toast} = useToast()

  // Form submit handler
// Frontend: LoginForm component in 'onSubmit' function
async function onSubmit(data) {
  
  setLoading(true);
  try {
    const response = await axios.post('/api/auth/login', data);
    const { token } = response.data;
    
    // Store the JWT token
    localStorage.setItem('token', token);

    toast({
      title: 'Login successful!',
      description: 'Redirecting to dashboard...',
    });
    console.log('logging to dashboard from login frontend');
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  } catch (error) {
    // Check for 404 and 401 errors and handle them accordingly
    if (error.response && error.response.status === 404) {
      toast({
        title: 'User not found',
        description: 'Redirecting to signup in 10s',
        variant: 'info',
        action: (
          <button
            className="text-blue-500 hover:underline"
            onClick={() => {
              router.push('/login');
            }}
          >
            Stay
          </button>
        ),
        className: 'toast-blurred-bg',
      });
      setTimeout(() => {
        router.push('/signup');
      }, 10000);
    } else if (error.response && error.response.status === 401) {
      toast({
        title: 'Incorrect password',
        description: 'Please check your password and try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Login failed',
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

            {/* Submit Button with Spinner */}
            <Button type="submit" disabled={loading} className="w-full flex justify-center items-center">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
            </Button>
          </form>
        </Form>
      {/* New here? Signup Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          New here?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
