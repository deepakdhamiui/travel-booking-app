// src/app/bookings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Booking, Vehicle } from "@/app/types/index";
import { fetchBookings, fetchVehicles } from "@/app/actions";
import Link from "next/link";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const bookingData = await fetchBookings();
      const vehicleData = await fetchVehicles();
      setBookings(bookingData);
      setVehicles(vehicleData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesPickup = filters.pickupLocation
      ? booking.pickupLocation.toLowerCase().includes(filters.pickupLocation.toLowerCase())
      : true;
    const matchesDropoff = filters.dropoffLocation
      ? booking.dropoffLocation.toLowerCase().includes(filters.dropoffLocation.toLowerCase())
      : true;
    const matchesDate = filters.date ? booking.date === filters.date : true;
    return matchesPickup && matchesDropoff && matchesDate;
  });

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-600">
          Booking Details
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">Pickup Location</label>
              <input
                type="text"
                name="pickupLocation"
                value={filters.pickupLocation}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                placeholder="Filter by pickup"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Drop-off Location</label>
              <input
                type="text"
                name="dropoffLocation"
                value={filters.dropoffLocation}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                placeholder="Filter by drop-off"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900"
              />
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings found.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-gray-700 font-semibold">Vehicle</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold">Passengers</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold">Seats</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold">Pickup</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold">Drop-off</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold">Date</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold">Contact</th>
                  <th className="py-3 px-4 text-gray-700 font-semibold">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => {
                  const vehicle = vehicles.find((v) => v.id === booking.vehicleId);
                  return (
                    <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">{vehicle?.type || 'Unknown'}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.selectedSeats.length}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.selectedSeats.join(', ')}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.pickupLocation}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.dropoffLocation}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.date}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.contactNumber || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.email || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/">
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}