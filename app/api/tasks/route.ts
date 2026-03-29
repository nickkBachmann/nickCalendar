export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('nickcalendar');
    
    const tasks = await db.collection('tasks').find({}).toArray();
    
    // Map _id and convert to required frontend shape if necessary
    // But since frontend uses string IDs, we'll store and use the custom id generated from frontend.
    // If we just save the full object it will insert an _id on mongo side, but our frontend needs the `id` field.
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const task = await request.json();
    const client = await clientPromise;
    const db = client.db('nickcalendar');
    
    // Insert the task using the task object received
    await db.collection('tasks').insertOne(task);
    
    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const taskUpdate = await request.json();
    const client = await clientPromise;
    const db = client.db('nickcalendar');
    
    const { id, ...updateData } = taskUpdate;
    if (!id) {
       return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });
    }

    // Since our task model uses string `id`, not Mongo's ObjectId `_id`
    await db.collection('tasks').updateOne({ id }, { $set: updateData });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
       return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('nickcalendar');
    
    await db.collection('tasks').deleteOne({ id });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
