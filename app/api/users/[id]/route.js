import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Single user fetch pannurathu (by ID)
export async function GET(request, { params }) {
  try {
    // params.id-a await pannanum (Next.js 15+ requirement)
    const { id } = await params;
    
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(rows[0]);
    
  } catch (error) {
    console.error('❌ GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - User update pannurathu
export async function PUT(request, { params }) {
  try {
    // params.id-a await pannanum
    const { id } = await params;
    const body = await request.json();
    const { name, email, number } = body;
    
    // Validation
    if (!name || !email || !number) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Update query
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, number = ? WHERE id = ?',
      [name, email, number, id]
    );
    
    // Check if user exists
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ User ${id} updated successfully`);
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: { id: parseInt(id), name, email, number }
    });
    
  } catch (error) {
    console.error('❌ PUT Error:', error);
    
    // Duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - User delete pannurathu
export async function DELETE(request, { params }) {
  try {
    // params.id-a await pannanum
    const { id } = await params;
    
    console.log(`🗑️ Deleting user with ID: ${id}`);
    
    // Delete query
    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    
    // Check if user exists
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ User ${id} deleted successfully`);
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      deletedId: parseInt(id)
    });
    
  } catch (error) {
    console.error('❌ DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}