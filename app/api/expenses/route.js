import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// GET - Fetch all expenses or by date range
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // YYYY-MM format

    // Get all expense keys
    let keys = [];
    try {
      keys = await kv.keys('expense:*') || [];
    } catch (e) {
      console.error('Error fetching expense keys:', e);
    }

    const expenses = [];
    for (const key of keys) {
      const expense = await kv.get(key);
      if (expense) {
        expenses.push({ id: key.replace('expense:', ''), ...expense });
      }
    }

    // Sort by date newest first
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter by month if specified
    let filtered = expenses;
    if (month) {
      filtered = expenses.filter(e => e.date && e.date.startsWith(month));
    }

    // Calculate totals
    const totalExpenses = filtered.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

    return NextResponse.json({ expenses: filtered, totalExpenses });
  } catch (error) {
    console.error('Expenses GET error:', error);
    return NextResponse.json({ error: error.message, expenses: [] }, { status: 500 });
  }
}

// POST - Create a new expense
export async function POST(request) {
  try {
    const body = await request.json();
    const { description, amount, date, category, paidBy, account, notes } = body;

    if (!description || !amount || !date) {
      return NextResponse.json({ error: 'Description, amount, and date required' }, { status: 400 });
    }

    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const expense = {
      description,
      amount: parseFloat(amount),
      date,
      category: category || 'general',
      paidBy: paidBy || '',
      account: account || '',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`expense:${id}`, expense);
    await kv.expire(`expense:${id}`, 365 * 24 * 60 * 60);

    return NextResponse.json({ success: true, id, expense });
  } catch (error) {
    console.error('Expense POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update an existing expense
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, description, amount, date, category, paidBy, account, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    if (!description || !amount || !date) {
      return NextResponse.json({ error: 'Description, amount, and date required' }, { status: 400 });
    }

    // Get existing to preserve createdAt
    const existing = await kv.get(`expense:${id}`);
    if (!existing) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    const updated = {
      description,
      amount: parseFloat(amount),
      date,
      category: category || 'general',
      paidBy: paidBy || '',
      account: account || '',
      notes: notes || '',
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`expense:${id}`, updated);
    await kv.expire(`expense:${id}`, 365 * 24 * 60 * 60);

    return NextResponse.json({ success: true, id, expense: updated });
  } catch (error) {
    console.error('Expense PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete an expense
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await kv.del(`expense:${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Expense DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
