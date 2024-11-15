'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
export default function CarDetails({ params }) {
  const { id } = React.use(params);

  const [car, setCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    images: [],
  });
  const router = useRouter();

  useEffect(() => {
    const fetchCar = async () => {
      const token=localStorage.getItem('token');
      const response = await axios.get(`/api/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Attach token to Authorization header
        },
      });
      setCar(response.data);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        tags: response.data.tags,
        images: response.data.images,
      });
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      title: car.title,
      description: car.description,
      tags: car.tags,
      images: car.images,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (e, index) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = e.target.value;
    setFormData((prev) => ({
      ...prev,
      tags: updatedTags,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      

    try {
      const token=localStorage.getItem('token');
      const response = await axios.put(`/api/cars/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Attach token to Authorization header
        },
      });
      setCar(response.data);
      setIsEditing(false);
      toast.success('Car details updated successfully');
    } catch (error) {
      toast.error('Failed to update car details');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/cars/${id}`);
      toast.success('Car deleted successfully');
      router.push('/cars');
    } catch (error) {
      toast.error('Failed to delete car');
    }
  };

  if (!car) return <p className="text-center text-gray-500">Loading...</p>;

  const handleBackToDashboard = () => {
    router.push('/dashboard'); // Redirects to the dashboard page
  };
  return (
    <div className="w-full max-w-4xl mx-auto my-6 space-y-6">
      <button onClick={handleBackToDashboard} className="text-gray-600 hover:text-gray-800 p-2">
          ⬅️
        </button>
      {/* Car Title */}
      <h1 className="text-4xl font-semibold text-gray-800">{car.title}</h1>

      {/* Car Description */}
      <p className="text-lg text-gray-600">{car.description}</p>

      {/* Car Tags */}
      <div className="flex gap-4 flex-wrap mt-4">
        {car.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Carousel for Images */}
      <Carousel className="w-full max-w-xs mt-6">
              <CarouselContent>
                {car.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <img
                            className="object-cover rounded-md w-full h-full"
                            src={`https://res.cloudinary.com/dtlcgbazf/image/upload/${image}`}
                            alt={`Car image ${index + 1}`}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

      {/* Edit and Delete Button */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleEditClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Edit Car
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete Car
        </button>
      </div>

      {/* Edit Form (Visible when isEditing is true) */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col">
            <label htmlFor="title" className="text-lg text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-lg text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-lg text-gray-700 mb-2">Tags</label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(e, index)}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
