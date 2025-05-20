import { thirdwebAuth } from "../../../utils/thirdwebAuth";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function POST(req: NextRequest) {

  const token = req.cookies.get("jwt")?.value;
  if (!token) {
    return NextResponse.json({ error: "No auth token" }, { status: 401 });
  }

  const verification = await thirdwebAuth.verifyJWT({ jwt: token });
  if (!verification.valid) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const address = (verification.parsedJWT as any).sub; // это адрес из куки из пейлоада
  if (!address) {
    return NextResponse.json({ error: "No address in token" }, { status: 400 });
  }
  console.log("INIT: address from JWT inside POST:", address);

  const { data: existingPlayer } = await supabase
    .from("players")
    .select("*")
    .eq("wallet_address", address)
    .single();

  if (!existingPlayer) {
    await supabase.from("players").insert({
      wallet_address: address,
      high_score: 0,
      total_score: 0,
      sessions_count: 0,
    });
  }

  return NextResponse.json({ success: true });
}
