export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('nickcalendar');
    
    const shifts = await db.collection('shifts').find({}).toArray();
    
    return NextResponse.json(shifts, { status: 200 });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json({ error: 'Failed to fetch shifts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const shift = await request.json();
    const client = await clientPromise;
    const db = client.db('nickcalendar');
    
    await db.collection('shifts').insertOne(shift);
    
    return NextResponse.json({ success: true, shift }, { status: 201 });
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json({ error: 'Failed to create shift' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const shiftUpdate = await request.json();
    const client = await clientPromise;
    const db = client.db('nickcalendar');
    
    const { id, ...updateData } = shiftUpdate;
    if (!id) {
       return NextResponse.json({ error: 'Missing shift ID' }, { status: 400 });
    }

    await db.collection('shifts').updateOne({ id }, { $set: updateData });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating shift:', error);
    return NextResponse.json({ error: 'Failed to update shift' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
       return NextResponse.json({ error: 'Missing shift ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('nickcalendar');
    
    await db.collection('shifts').deleteOne({ id });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return NextResponse.json({ error: 'Failed to delete shift' }, { status: 500 });
  }
}
