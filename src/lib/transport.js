export function getCrowdLevel(occupiedSeats, capacity) {
  if (capacity <= 0 || occupiedSeats <= 0) return "LOW";
  if (occupiedSeats >= capacity) return "FULL";

  const occupancyPercentage = occupiedSeats / capacity;
  if (occupancyPercentage >= 0.7) return "HIGH";
  if (occupancyPercentage >= 0.4) return "MODERATE";
  return "LOW";
}
