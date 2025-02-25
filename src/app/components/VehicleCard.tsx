// src/app/components/VehicleCard.tsx
import Link from 'next/link';
import { Vehicle } from '../types/index';

interface VehicleCardProps {
  vehicle: Vehicle;
  remainingCapacity?: number; // Add this if you pass it from the parent
}

export default function VehicleCard({ vehicle, remainingCapacity }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{vehicle.type}</h2>
      <p className="text-gray-600 mb-1">
        Capacity: <span className="font-medium">{vehicle.capacity}</span> (including driver)
      </p>
      {remainingCapacity !== undefined && (
        <p className="text-gray-600 mb-1">
          Remaining Capacity: <span className="font-medium">{remainingCapacity}</span>
        </p>
      )}
      <p className="text-gray-600 mb-1">
        Route: <span className="font-medium">{vehicle.startPoint} to {vehicle.endPoint}</span>
      </p>
      <p className="text-gray-600">
        Status:{' '}
        <span className={`font-semibold ${vehicle.available ? 'text-teal-500' : 'text-red-500'}`}>
          {vehicle.available ? 'Available' : 'Unavailable'}
        </span>
      </p>
      <Link href={`/booking/${vehicle.id}`}>
        <button
          disabled={!vehicle.available}
          className={`mt-4 w-full py-2.5 rounded-lg text-white font-semibold transition-all duration-200 ${
            vehicle.available
              ? 'bg-teal-600 hover:bg-teal-700 hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Book Now
        </button>
      </Link>
    </div>
  );
}