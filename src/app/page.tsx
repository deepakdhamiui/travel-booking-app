// src/app/page.tsx
import { Vehicle } from "@/app/types/index";
import VehicleCard from "@/app/components/VehicleCard";
import Link from "next/link";
import { fetchVehicles, fetchBookings } from "@/app/actions";

export default async function Home() {
  const vehicles: Vehicle[] = await fetchVehicles();
  const bookings = await fetchBookings();

  // Calculate total booked passengers per vehicle using selectedSeats.length
  const bookedPassengers = bookings.reduce((acc, booking) => {
    acc[booking.vehicleId] = (acc[booking.vehicleId] || 0) + booking.selectedSeats.length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-600">
        Travel Booking App
      </h1>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-6">
          <Link href="/add-vehicle">
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all">
              Add New Vehicle
            </button>
          </Link>
          <Link href="/bookings">
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all">
              View Bookings
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              remainingCapacity={vehicle.capacity - 1 - (bookedPassengers[vehicle.id] || 0)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}