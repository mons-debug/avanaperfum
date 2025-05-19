import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import ContactForm from '@/models/ContactForm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message } = body;
    
    // Basic validation
    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, phone, and message are required' },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    const newContactForm = await ContactForm.create({
      name,
      phone,
      message,
    });
    
    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
