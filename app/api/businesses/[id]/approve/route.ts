import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const { data: business, error } = await supabase
      .from("businesses")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error approving business:", error)
      return NextResponse.json({ error: "Failed to approve business" }, { status: 500 })
    }

    return NextResponse.json({ message: "Business approved successfully", business })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
