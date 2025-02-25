// src/app/utils/csv.ts
import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { Vehicle, Booking } from '../types/index';

const VEHICLES_FILE = './src/app/data/vehicles.csv';
const BOOKINGS_FILE = './src/app/data/bookings.csv';

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const data = await fs.readFile(VEHICLES_FILE, 'utf-8');
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      skip_records_with_error: true,
      cast: (value, context) => {
        if (context.column === 'capacity') return Number(value);
        if (context.column === 'available') return value === 'true';
        return value;
      },
    });
    return records as Vehicle[];
  } catch (error) {
    console.error('Error parsing vehicles.csv:', error);
    return [];
  }
}

export async function addVehicle(newVehicle: Vehicle): Promise<void> {
  const vehicles = await getVehicles();
  vehicles.push(newVehicle);
  const csvData = stringify(vehicles, { header: true });
  await fs.writeFile(VEHICLES_FILE, csvData, 'utf-8');
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf-8');
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      skip_records_with_error: true,
      cast: (value, context) => {
        if (context.column === 'selectedSeats') {
          try {
            // Remove extra quotes or backslashes if present
            const cleanedValue = value.replace(/^"|"$/g, '').replace(/\\"/g, '"');
            return JSON.parse(cleanedValue);
          } catch (e) {
          //  console.error(`Invalid JSON in selectedSeats on line ${context?.line}: "${value}"`, e);
            return []; // Return empty array for invalid JSON
          }
        }
        return value;
      },
    });
    return records as Booking[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error('Error parsing bookings.csv:', error);
    return [];
  }
}

export async function addBooking(booking: Booking): Promise<void> {
  const bookings = await getBookings();
  bookings.push(booking);
  const csvData = stringify(bookings, {
    header: true,
    quote: '"', // Explicitly use double quotes
    quoted_string: true, // Ensure strings are quoted
    cast: {
      object: (value) => JSON.stringify(value), // Correctly stringify arrays
    },
  });
  await fs.writeFile(BOOKINGS_FILE, csvData, 'utf-8');
}