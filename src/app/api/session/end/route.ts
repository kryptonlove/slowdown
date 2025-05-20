import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const { sessionId, address, score, duration } = await req.json();

  if (!sessionId || !address || !score || !duration) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  // Находим игрока
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('*') // нужно получить high_score, total_score, sessions_count
    .eq('wallet_address', address)
    .single();

  if (playerError || !player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  // Обновляем сессию по session ID
  const { error: updateError } = await supabase
    .from('sessions')
    .update({
      end_time: new Date(),
      duration: duration,
      score: score,
      valid: true,
    })
    .eq('session_id', sessionId)
    .eq('player_id', player.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Обновляем high_score, total_score, sessions_count
  const updates: any = {
    sessions_count: player.sessions_count + 1,
    total_score: player.total_score + score,
  };

  if (score > player.high_score) {
    updates.high_score = score;
  }

  const { error: playerUpdateError } = await supabase
    .from('players')
    .update(updates)
    .eq('id', player.id);

  if (playerUpdateError) {
    return NextResponse.json({ error: 'Failed to update player stats' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
