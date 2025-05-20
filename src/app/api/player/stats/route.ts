import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  const { data: player, error } = await supabase
    .from('players')
    .select('high_score, total_score')
    .eq('wallet_address', address)
    .single();

  if (error || !player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    highScore: player.high_score,
    totalScore: player.total_score,
  });
}