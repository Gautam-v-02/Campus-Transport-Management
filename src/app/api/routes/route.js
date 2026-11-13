import dbConnect from '@/lib/mongodb';
import Route from '@/models/Route';
import { NextResponse } from 'next/server';

// GET: Fetch all routes
export async function GET() {
  try {
    await dbConnect();
    const routes = await Route.find({});
    return NextResponse.json({ success: true, data: routes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST: Create a new route
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newRoute = await Route.create(body);
    return NextResponse.json({ success: true, data: newRoute }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}