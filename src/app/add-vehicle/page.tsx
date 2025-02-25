// src/app/add-vehicle/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveVehicle } from "@/app/actions";

export default function AddVehiclePage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState({
    type: "",
    capacity: 0,
    startPoint: "",
    endPoint: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await saveVehicle(formData);
    alert("Vehicle added successfully!");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-600">
          Add New Vehicle
        </h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Vehicle Type</label>
            <input
              type="text"
              name="type"
              value={vehicle.type}
              onChange={(e) => setVehicle({ ...vehicle, type: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="e.g., Car (4+1)"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              name="capacity"
              min="2"
              value={vehicle.capacity}
              onChange={(e) =>
                setVehicle({ ...vehicle, capacity: Number(e.target.value) })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="Including driver"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Start Point</label>
            <input
              type="text"
              name="startPoint"
              value={vehicle.startPoint}
              onChange={(e) => setVehicle({ ...vehicle, startPoint: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="e.g., Downtown"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">End Point</label>
            <input
              type="text"
              name="endPoint"
              value={vehicle.endPoint}
              onChange={(e) => setVehicle({ ...vehicle, endPoint: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="e.g., Airport"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 hover:scale-105"
          >
            Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}