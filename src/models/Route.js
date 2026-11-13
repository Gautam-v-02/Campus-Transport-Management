import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  busNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, default: 'Active' },
}, { timestamps: true });

export default mongoose.models.Route || mongoose.model('Route', RouteSchema);