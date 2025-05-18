"use client"

import { Menu, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onOpenSidebar: () => void
  onNewMemo: () => void
}

export function Header({ onOpenSidebar, onNewMemo }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-3 border-b bg-background sticky top-0 z-10">
      <Button variant="ghost" size="icon" onClick={onOpenSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">メニューを開く</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={onNewMemo}>
        <Plus className="h-5 w-5" />
        <span className="sr-only">新規メモ</span>
      </Button>
    </header>
  )
}
