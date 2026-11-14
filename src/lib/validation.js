// Schema-based validation with Zod (INT252 Unit IV, INT257 Unit III).
// This file runs in the browser (instant checks) and on the server (the real check),
// so it must not import anything server-only.
import { z } from "zod";
import { STOPS } from "@/lib/lastMile";

// A driver updates a vehicle
export const vehicleUpdateSchema = z.object({
  status: z.enum(["available", "busy", "offline"], { message: "Choose a valid status" }),
  seatsFree: z.coerce
    .number({ message: "Seats must be a number" })
    .int("Seats must be a whole number")
    .min(0, "Seats cannot be negative")
    .max(6, "Maximum 6 seats"),
  etaMin: z.coerce
    .number({ message: "Pickup time must be a number" })
    .int("Pickup time must be a whole number")
    .min(0, "Pickup time cannot be negative")
    .max(60, "Pickup time cannot be more than 60 minutes"),
});

// Adding a new vehicle through the API
export const vehicleCreateSchema = z.object({
  id: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}-\d{2}$/, "Use a format like ER-08"),
  type: z.enum(["e-rickshaw", "auto"], { message: "Choose a vehicle type" }),
  driver: z.string().trim().min(2, "Enter the driver's name").max(40, "Name is too long"),
  plate: z.string().trim().toUpperCase().min(4, "Enter the number plate").max(14, "Number plate is too long"),
  stopId: z.string().refine((id) => STOPS.some((s) => s.id === id), "Choose a valid stop"),
  seatsTotal: z.coerce.number({ message: "Seats must be a number" }).int().min(1, "At least 1 seat").max(6, "Maximum 6 seats"),
});
