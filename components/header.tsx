"use client"

import { Menu, Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onOpenSidebar: () => void
  onNewMemo: () => void
  isNew?: boolean
  isSaving?: boolean
  onDelete?: () => void
}

export function Header({ onOpenSidebar, onNewMemo, isNew = true, isSaving = false, onDelete }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-3 border-b bg-background sticky top-0 z-10">
      <Button variant="ghost" size="icon" onClick={onOpenSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">メニューを開く</span>
      </Button>
      <div className="flex items-center gap-2">
        {!isNew && onDelete && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">削除</span>
          </Button>
        )}
        {isSaving && (
          <div className="text-muted-foreground flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
            <span className="text-xs">保存中...</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={onNewMemo}>
          <Plus className="h-5 w-5" />
          <span className="sr-only">新規メモ</span>
        </Button>
      </div>
    </header>
  )
}
