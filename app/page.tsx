import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/car.jpg')", // Replace with your car image
          filter: "blur(3px)", // Add blur effect
          backgroundAttachment: "fixed",
          zIndex: -1, // Send it to the background
        }}
      />

      {/* Foreground Content */}
      <div className="relative flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-lg p-6">
        <h1 className="text-4xl text-white mb-6">Welcome</h1>
        <Link
          href="/login"
          className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white text-lg font-semibold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
