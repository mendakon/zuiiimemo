"use client"

import { useState, useEffect } from "react"
import type { Memo } from "@/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, Plus, Search, X, MoreVertical, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface SidebarProps {
  memos: Memo[]
  activeMemoId?: string
  onSelectMemo: (memo: Memo) => void
  onNewMemo: () => void
  isOpen: boolean
  onClose: () => void
  onDeleteMemo: (id: string) => void
}

export function Sidebar({ memos, activeMemoId, onSelectMemo, onNewMemo, isOpen, onClose, onDeleteMemo }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMemos, setFilteredMemos] = useState<Memo[]>(memos)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    if (searchQuery) {
      setFilteredMemos(
        memos.filter(
          (memo) =>
            memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (memo.content && memo.content.toLowerCase().includes(searchQuery.toLowerCase())),
        ),
      )
    } else {
      setFilteredMemos(memos)
    }
  }, [searchQuery, memos])

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-background w-80 shadow-lg h-screen">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">メモ</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">サイドバーを閉じる</span>
        </Button>
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="メモを検索..."
            className="pl-8 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">検索をクリア</span>
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        <Button className="w-full" onClick={onNewMemo}>
          <Plus className="mr-2 h-4 w-4" />
          新規メモ
        </Button>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 grid gap-2 min-w-0">
          {filteredMemos.length > 0 ? (
            filteredMemos.map((memo) => (
              <Button
                key={memo.id}
                variant={memo.id === activeMemoId ? "secondary" : "ghost"}
                className="justify-start h-auto py-3 px-4 w-full min-w-0"
                onClick={() => onSelectMemo(memo)}
              >
                <div className="flex items-center w-full min-w-0">
                  <div className="flex-1 flex flex-col items-start text-left min-w-0">
                    <span className="font-medium truncate w-full">{memo.title || "無題"}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {format(new Date(memo.updated_at), "yyyy年MM月dd日 HH:mm", { locale: ja })}
                    </span>
                    {memo.content && (
                      <span className="text-sm text-muted-foreground mt-1 w-full truncate block">
                        {memo.content}
                      </span>
                    )}
                  </div>
                  {openMenuId === memo.id ? (
                    <div
                      className="ml-2 bg-red-500 text-white rounded p-2 shadow z-10 flex items-center justify-center cursor-pointer"
                      onClick={e => { e.stopPropagation(); onDeleteMemo(memo.id); setOpenMenuId(null); }}
                      title="削除"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div
                      className="ml-2 p-1 rounded hover:bg-accent focus:outline-none cursor-pointer"
                      onClick={e => { e.stopPropagation(); setOpenMenuId(memo.id); }}
                      tabIndex={-1}
                    >
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">メモが見つかりませんでした</div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
