"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { NewMemo } from "@/types"

// メモの一覧を取得
export async function getMemos() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("memos").select("*").order("updated_at", { ascending: false })

  if (error) {
    console.error("メモの取得に失敗しました:", error)
    return []
  }

  return data
}

// メモを作成
export async function createMemo(memo: NewMemo) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("memos").insert([memo]).select().single()

  if (error) {
    console.error("メモの作成に失敗しました:", error)
    return null
  }

  revalidatePath("/")
  return data
}

// メモを更新
export async function updateMemo(id: string, memo: Partial<NewMemo>) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("memos").update(memo).eq("id", id).select().single()

  if (error) {
    console.error("メモの更新に失敗しました:", error)
    return null
  }

  revalidatePath("/")
  return data
}

// メモを削除
export async function deleteMemo(id: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("memos").delete().eq("id", id)

  if (error) {
    console.error("メモの削除に失敗しました:", error)
    return false
  }

  revalidatePath("/")
  return true
}
