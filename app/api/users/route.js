import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET Request - Ella users-ayum fetch pannurathu
export async function GET() {
  try {
    // SQL query run pannurathu
    // pool.query() → [rows, fields] return pannum
    const [rows] = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    
    console.log(`✅ Fetched ${rows.length} users`);
    
    // JSON response return pannurathu
    return NextResponse.json(rows, { status: 200 });
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    
    // Error response return pannurathu
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}

// POST Request - Pudhu user add pannurathu
export async function POST(request) {
  try {
    // Request body la irundhu data extract pannurathu
    const body = await request.json();
    const { name, email, number } = body;
    
    // Validation - Ella fields-um irukkaa check pannurathu
    if (!name || !email || !number) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Email format validate pannurathu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Phone number validate pannurathu (10 digits)
    if (number.length < 10) {
      return NextResponse.json(
        { error: 'Phone number must be at least 10 digits' },
        { status: 400 }
      );
    }
    
    // Database la insert pannurathu
    // ? → Prepared statement (SQL injection prevent pannum)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, number) VALUES (?, ?, ?)',
      [name, email, number]
    );
    
    console.log(`✅ User created with ID: ${result.insertId}`);
    
    // Success response
    return NextResponse.json(
      { 
        success: true,
        message: 'User created successfully',
        userId: result.insertId,
        data: { id: result.insertId, name, email, number }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('❌ Error creating user:', error);
    
    // Duplicate email error check pannurathu
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    // General error response
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}