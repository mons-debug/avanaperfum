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
        { success: false, error: 'Champs requis manquants : nom, téléphone et message sont obligatoires' },
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
      { success: true, message: 'Formulaire de contact soumis avec succès' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { success: false, error: 'Échec de l\'envoi du formulaire de contact' },
      { status: 500 }
    );
  }
}
