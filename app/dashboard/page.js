'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [cars, setCars] = useState([]);
  const router = useRouter();
  const { toast } = useToast();
  const cloudinaryBaseUrl = 'https://res.cloudinary.com/{process.env.CLOUDINARY_CLOUD_NAME}/image/upload/';

  // Fetch the user's cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        // Check if the token exists
        if (!token) {
          toast({
            title: 'Session expired',
            description: 'Your session has expired. Please log in again.',
            variant: 'destructive',
          });
    
          // Redirect to the login page after a short delay to allow the toast to show
          setTimeout(() => {
            router.push('/login');
          }, 500);
    
          return;
        }

        // Include the token in the Authorization header for the request
        const response = await axios.get('/api/cars', {
          headers: {
            Authorization: `Bearer ${token}`,  // Attach token to Authorization header
          },
        });

        // Set the fetched cars to state
        setCars(response.data);
      } catch (error) {
        console.error('Failed to fetch cars', error);
        // Optionally handle other errors (e.g., invalid token)
        if (error.response && error.response.status === 401) {
          console.log('Token is invalid or expired. Redirecting to login...');
          window.location.href = '/login';  // Redirect to login page if token is invalid
        } else if (error.response && error.response.status === 500) {
          console.log('Server error. Redirecting to login...');
          window.location.href = '/login';  // Redirect to login page if there's a server error
        }
      }
    };

    fetchCars();
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Add New Car Button click handler
  const handleAddNewCar = () => {
    router.push('/create'); // Redirect to the create car page
  };

  // Sign Out Button click handler
  const handleSignOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    
    // Show sign-out success toast
    toast({
      title: 'Signed out',
      description: 'You have successfully signed out.',
      variant: 'success',
    });

    // Redirect to the login page
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Your Cars</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleAddNewCar}>
            Add New Car
          </Button>
          <Button variant="outline" onClick={handleSignOut} className="border-black rounded-3xl ">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car._id}
            className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-md"
          >
            <div className="w-full h-48 bg-gray-200">
              {/* Display the first image as the thumbnail */}
              {car.images[0] && (
                <img
                  src={`${cloudinaryBaseUrl}${car.images[0]}.jpg`}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{car.title}</h2>
              <p className="text-sm text-gray-600">{car.description}</p>
              <Link href={`/car/${car._id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
