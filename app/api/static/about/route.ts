import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import StaticContent from '@/models/StaticContent';

export async function GET() {
  try {
    await connectToDB();
    
    const aboutContent = await StaticContent.findOne({ section: 'about' });
    
    if (!aboutContent) {
      return NextResponse.json(
        { success: false, error: 'About content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: aboutContent });
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    // Update or create the about content
    const updatedContent = await StaticContent.findOneAndUpdate(
      { section: 'about' },
      { 
        section: 'about',
        content,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update about content' },
      { status: 500 }
    );
  }
}
