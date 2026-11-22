import mongoose from 'mongoose';

const StopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    minutesFromStart: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const RouteSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true, trim: true },
    busNumber: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true },
    status: { type: String, default: 'Active' },
    departureTime: { type: String, default: '08:00' },
    stops: { type: [StopSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Route || mongoose.model('Route', RouteSchema); 