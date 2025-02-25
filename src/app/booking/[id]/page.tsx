// src/app/booking/[id]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { use } from "react";
import { Vehicle } from "@/app/types/index";
import { fetchVehicles, saveBooking , fetchBookings} from "@/app/actions";

export default function BookingPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { id } = params;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [date, setDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadVehicle() {
      const vehicles = await fetchVehicles();
      const targetVehicle = vehicles.find((v) => v.id === id);
      if (targetVehicle) {
        setVehicle(targetVehicle);
        setPickupLocation(targetVehicle.startPoint);
        setDropoffLocation(targetVehicle.endPoint);
        const bookings = await fetchBookings();
        const vehicleBookings = bookings.filter((b) => b.vehicleId === id);
        const booked = new Set(vehicleBookings.flatMap((b) => b.selectedSeats));
        setBookedSeats(booked);
      }
    }
    loadVehicle();
  }, [id]);

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.has(seatId) || vehicle?.seats.find((s) => s.id === seatId)?.isDriver) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    const formData = new FormData();
    formData.append('pickupLocation', pickupLocation);
    formData.append('dropoffLocation', dropoffLocation);
    formData.append('selectedSeats', JSON.stringify(selectedSeats));
    formData.append('date', date);
    formData.append('contactNumber', contactNumber);
    formData.append('email', email);

    const result = await saveBooking(formData);
    alert(result.message);
    if (result.success) router.push("/");
  };

  if (!vehicle) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  const maxRow = Math.max(...vehicle.seats.map((s) => s.row));
  const maxCol = Math.max(...vehicle.seats.map((s) => s.col));

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-600">
          Book {vehicle.type}
        </h1>

        {/* Seat Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Select Your Seats</h2>
          <div className="relative flex justify-center">
            <div className="grid gap-4" style={{ gridTemplateRows: `repeat(${maxRow}, minmax(0, 1fr))` }}>
              {Array.from({ length: maxRow }, (_, rowIdx) => (
                <div key={rowIdx} className="flex gap-4 justify-center">
                  {vehicle.seats
                    .filter((seat) => seat.row === rowIdx + 1)
                    .map((seat) => {
                      const isDriver = seat.isDriver;
                      const isBooked = bookedSeats.has(seat.id);
                      const isSelected = selectedSeats.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => toggleSeat(seat.id)}
                          disabled={isBooked || isDriver}
                          className={`w-12 h-12 rounded-lg border flex items-center justify-center text-sm font-medium ${
                            isDriver
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : isBooked
                              ? 'bg-red-200 text-red-600 cursor-not-allowed'
                              : isSelected
                              ? 'bg-teal-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-teal-200'
                          }`}
                        >
                          {seat.id}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
            {/* Steering Wheel for Driver */}
            {vehicle.seats.some((s) => s.isDriver) && (
              <div className="absolute left-0 top-0 -ml-8 mt-2">
                <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-600">
                  🚗
                </div>
              </div>
            )}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Selected Seats: {selectedSeats.length} / {vehicle.capacity - 1}
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Pickup Location</label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Drop-off Location</label>
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Contact Number (Optional)</label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="Enter contact number"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Email ID (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="Enter email address"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 hover:scale-105"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}