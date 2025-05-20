import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const { sessionId, address, startTime } = await req.json();

  if (!sessionId || !address || !startTime) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  // Находим игрока по wallet адресу
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id')
    .eq('wallet_address', address)
    .single();

  if (playerError || !player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  // Вставляем новую сессию
  const { error: insertError } = await supabase.from('sessions').insert({
    player_id: player.id,
    session_id: sessionId,
    start_time: new Date(startTime),
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
