'use client'
import { useToast } from '@/hooks/use-toast'; // Ensure this is imported
import { useState } from 'react';
import MediaUploader from '@/components/MediaUploader'; // Ensure this component is correctly imported
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the CreateCar schema
const CreateCarSchema = z.object({
  title: z.string()
    .min(1, { message: 'Title is required.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
  
  description: z.string()
    .max(500, { message: 'Description cannot exceed 500 characters.' })
    .optional(),  // Description is optional, can be left empty
  
  tags: z.string()
    .optional()  // Tags are optional, can be left empty
    .refine((value) => value.split(',').length <= 5, {
      message: 'You can provide a maximum of 5 tags.',
    }),

  images: z.array(z.string()).max(10, { message: 'You can upload up to 10 images.' }).optional(),
});

export default function CreateCar() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // Ensure images is initialized as an empty array
  const router = useRouter();
  const { toast } = useToast();  // Use the toast hook

  const form = useForm({
    resolver: zodResolver(CreateCarSchema),
    defaultValues: { title: '', description: '', tags: '', images: [] },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = {
        ...data,
        images, // Array of image public_ids
      };
      console.log(formData);
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/cars', formData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Attach token to Authorization header
        },
      });

      if (response.status === 201) {
        toast({
          title: 'Car created successfully!',
          description: 'Redirecting to dashboard...',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error creating car',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-md lg:w-1/2 md:w-3/4 sm:w-11/12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter car title" {...field} />
                  </FormControl>
                  <FormDescription>The title of the car listing.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter car description" {...field} />
                  </FormControl>
                  <FormDescription>Provide a brief description of the car.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tags (comma-separated)" {...field} />
                  </FormControl>
                  <FormDescription>Keywords related to the car.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Field */}
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <MediaUploader
                    onValueChange={(newPublicId) => {
                      setImages((prevImages) => {
                        // Ensure prevImages is an array before using it
                        const newImages = Array.isArray(prevImages) ? [...prevImages, newPublicId] : [newPublicId];
                        return newImages;
                      });
                      // Show success toast after a successful image upload
                      toast({
                        title: 'Image uploaded successfully!',
                        description: 'Your image was uploaded.',
                      });
                    }}
                    setImage={setImages}
                    publicId={images[0] || ""}
                    image={{}}
                    type="fill"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Car'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
