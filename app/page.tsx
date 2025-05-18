"use client"

import { useState, useEffect } from "react"
import type { Memo } from "@/types"
import { MemoEditor } from "@/components/memo-editor"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { deleteMemo, getMemos } from "./actions"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [activeMemo, setActiveMemo] = useState<Memo | null>(null)
  const [isNewMemo, setIsNewMemo] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastSavedId, setLastSavedId] = useState<string | null>(null)

  // メモの一覧を取得
  const fetchMemos = async () => {
    try {
      const data = await getMemos()
      setMemos(data)
      setIsLoading(false)
    } catch (error) {
      console.error("メモの取得に失敗しました:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMemos()
  }, [])

  const handleSelectMemo = (memo: Memo) => {
    setActiveMemo(memo)
    setIsNewMemo(false)
    setIsSidebarOpen(false)
  }

  const handleNewMemo = () => {
    setActiveMemo(null)
    setIsNewMemo(true)
    setIsSidebarOpen(false)
  }

  const handleSaveMemo = (memo: Memo) => {
    // 同じメモが短時間に連続して保存された場合は通知しない
    const isRepeatedSave = memo.id === lastSavedId
    setLastSavedId(memo.id)

    if (isNewMemo) {
      // 新規メモの場合は一覧に追加し、編集中のメモを更新
      setMemos([memo, ...memos])
      setActiveMemo(memo)
      setIsNewMemo(false)
    } else {
      // 既存メモの場合は更新
      setMemos(memos.map((m) => (m.id === memo.id ? memo : m)))
    }
  }

  const handleDeleteMemo = async (id: string) => {
    const success = await deleteMemo(id)
    if (success) {
      setMemos(memos.filter((memo) => memo.id !== id))
      setActiveMemo(null)
      setIsNewMemo(true)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Sidebar
        memos={memos}
        activeMemoId={activeMemo?.id}
        onSelectMemo={handleSelectMemo}
        onNewMemo={handleNewMemo}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onDeleteMemo={handleDeleteMemo}
      />

      <div className="flex flex-col h-full">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} onNewMemo={handleNewMemo} />
        <main className="flex-1">
          <MemoEditor
            memo={activeMemo || undefined}
            isNew={isNewMemo}
            onSave={handleSaveMemo}
            onDelete={handleDeleteMemo}
          />
        </main>
      </div>
    </div>
  )
}
