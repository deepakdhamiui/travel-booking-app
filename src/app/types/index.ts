// src/app/types/index.ts
export interface Seat {
  id: string;
  row: number;
  col: number;
  isDriver?: boolean;
}

export interface Vehicle {
  id: string;
  type: string;
  capacity: number;
  available: boolean;
  startPoint: string;
  endPoint: string;
  seats: Seat[];
}

export interface Booking {
  vehicleId: string;
  selectedSeats: string[];
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  contactNumber?: string;
  email?: string;
}

export const seatLayouts: Record<string, Seat[]> = {
  "Car (4+1)": [
    { id: "A1", row: 1, col: 1, isDriver: true },
    { id: "A2", row: 1, col: 3 },
    { id: "B1", row: 2, col: 1 },
    { id: "B2", row: 2, col: 2 },
    { id: "B3", row: 2, col: 3 },
  ],
  "Van (7+1)": [
    { id: "A1", row: 1, col: 1, isDriver: true },
    { id: "A2", row: 1, col: 3 },
    { id: "B1", row: 2, col: 1 },
    { id: "B2", row: 2, col: 3 },
    { id: "C1", row: 3, col: 1 },
    { id: "C2", row: 3, col: 2 },
    { id: "C3", row: 3, col: 3 },
  ],
  "Minibus (8+1)": [
    { id: "A1", row: 1, col: 1, isDriver: true },
    { id: "A2", row: 1, col: 3 },
    { id: "B1", row: 2, col: 1 },
    { id: "B2", row: 2, col: 3 },
    { id: "C1", row: 3, col: 1 },
    { id: "C2", row: 3, col: 3 },
    { id: "D1", row: 4, col: 1 },
    { id: "D2", row: 4, col: 3 },
  ],
};