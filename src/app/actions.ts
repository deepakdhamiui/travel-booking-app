// src/app/actions.ts
'use server';

import fs from 'fs/promises';
import { stringify } from 'csv-stringify/sync';
import { Vehicle, Booking, seatLayouts } from './types/index';
import { getVehicles, addVehicle, getBookings, addBooking } from './utils/csv';

export async function fetchVehicles(): Promise<Vehicle[]> {
  const vehicles = await getVehicles();
  const bookings = await getBookings();

  const bookedSeats = bookings.reduce((acc, booking) => {
    booking.selectedSeats.forEach((seat) => {
      if (!acc[booking.vehicleId]) acc[booking.vehicleId] = new Set();
      acc[booking.vehicleId].add(seat);
    });
    return acc;
  }, {} as Record<string, Set<string>>);

  return vehicles.map((vehicle) => {
    const seats = seatLayouts[vehicle.type] || [];
    const bookedSeatCount = bookedSeats[vehicle.id]?.size || 0;
    return {
      ...vehicle,
      seats,
      available: bookedSeatCount < vehicle.capacity - 1,
    };
  });
}

export async function fetchBookings(): Promise<Booking[]> {
  return await getBookings();
}

export async function saveVehicle(formData: FormData): Promise<void> {
  const type = formData.get('type') as string;
  const capacity = Number(formData.get('capacity'));
  const seats = seatLayouts[type] || [];

  const newVehicle: Vehicle = {
    id: Date.now().toString(),
    type,
    capacity,
    available: true,
    startPoint: formData.get('startPoint') as string,
    endPoint: formData.get('endPoint') as string,
    seats,
  };
  await addVehicle(newVehicle);
}

export async function saveBooking(formData: FormData): Promise<{ success: boolean; message: string }> {
  const pickupLocation = formData.get('pickupLocation') as string;
  const dropoffLocation = formData.get('dropoffLocation') as string;
  const selectedSeats = JSON.parse(formData.get('selectedSeats') as string) as string[];
  const vehicles = await getVehicles();
  const bookings = await getBookings();

  const bookedSeats = bookings.reduce((acc, booking) => {
    booking.selectedSeats.forEach((seat) => {
      if (!acc[booking.vehicleId]) acc[booking.vehicleId] = new Set();
      acc[booking.vehicleId].add(seat);
    });
    return acc;
  }, {} as Record<string, Set<string>>);

  const availableVehicle = vehicles.find((v) => {
    const booked = bookedSeats[v.id] || new Set();
    return (
      v.startPoint === pickupLocation &&
      v.endPoint === dropoffLocation &&
      selectedSeats.every((seat) => !booked.has(seat)) &&
      v.capacity - 1 - booked.size >= selectedSeats.length
    );
  });

  if (!availableVehicle) {
    return { success: false, message: 'No available vehicle or seats for this route.' };
  }

  const booking: Booking = {
    vehicleId: availableVehicle.id,
    selectedSeats,
    pickupLocation,
    dropoffLocation,
    date: formData.get('date') as string,
    contactNumber: formData.get('contactNumber') as string | undefined,
    email: formData.get('email') as string | undefined,
  };

  await addBooking(booking);

  const updatedVehicles = vehicles.map((v) => {
    const booked = (bookedSeats[v.id]?.size || 0) + (v.id === availableVehicle.id ? selectedSeats.length : 0);
    return { ...v, available: booked < v.capacity - 1 };
  });
  const csvData = stringify(updatedVehicles, { header: true });
  await fs.writeFile('./src/app/data/vehicles.csv', csvData, 'utf-8');

  return { success: true, message: `Booking successful! Vehicle: ${availableVehicle.type}` };
}