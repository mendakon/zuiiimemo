"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Memo } from "@/types"
import { updateMemo, createMemo } from "@/app/actions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface MemoEditorProps {
  memo?: Memo
  isNew?: boolean
  onSave?: (memo: Memo) => void
  onDelete?: (id: string) => void
}

export function MemoEditor({ memo, isNew = false, onSave, onDelete }: MemoEditorProps) {
  const [title, setTitle] = useState(memo?.title || "")
  const [content, setContent] = useState(memo?.content || "")
  const [isSaving, setIsSaving] = useState(false)
  const [autoTitle, setAutoTitle] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  // 初期値を保存して変更を検出するための参照
  const initialTitleRef = useRef(memo?.title || "")
  const initialContentRef = useRef(memo?.content || "")

  useEffect(() => {
    if (isNew && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isNew])

  useEffect(() => {
    if (!isFocused && !isNew) {
      if (memo) {
        setTitle(memo.title)
        setContent(memo.content || "")
        setAutoTitle(false)
        initialTitleRef.current = memo.title
        initialContentRef.current = memo.content || ""
        setHasChanges(false)
      }
    }
    // isNew時は初期化しない
  }, [memo, isFocused, isNew])

  // コンテンツの最初の行をタイトルとして使用
  useEffect(() => {
    if (autoTitle && content) {
      const firstLine = content.split("\n")[0].trim()
      if (firstLine) {
        const newTitle = firstLine.length > 50 ? firstLine.substring(0, 50) + "..." : firstLine
        setTitle(newTitle)
      } else {
        setTitle("無題のメモ")
      }
    }
  }, [content, autoTitle])

  // 変更を検出
  useEffect(() => {
    const titleChanged = title !== initialTitleRef.current
    const contentChanged = content !== initialContentRef.current
    setHasChanges(titleChanged || contentChanged)
  }, [title, content])

  // 自動保存処理
  const saveChanges = useCallback(async () => {
    if (!hasChanges || !title) return

    setIsSaving(true)
    try {
      let savedMemo

      if (isNew) {
        savedMemo = await createMemo({ title, content })
        if (savedMemo) {
          initialTitleRef.current = savedMemo.title
          initialContentRef.current = savedMemo.content || ""
          setHasChanges(false)
        }
      } else if (memo) {
        savedMemo = await updateMemo(memo.id, { title, content })
        if (savedMemo) {
          initialTitleRef.current = savedMemo.title
          initialContentRef.current = savedMemo.content || ""
          setHasChanges(false)
        }
      }

      if (savedMemo && onSave) {
        onSave(savedMemo)
      }
    } catch (error) {
      console.error("メモの保存に失敗しました:", error)
    } finally {
      setIsSaving(false)
    }
  }, [title, content, hasChanges, isNew, memo, onSave])

  // 入力後の自動保存
  useEffect(() => {
    if (hasChanges) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveChanges()
      }, 1000) // 1秒後に保存
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [hasChanges, saveChanges])

  // フォーカスが外れた時に保存
  const handleBlur = () => {
    if (hasChanges) {
      saveChanges()
    }
  }

  const handleDelete = async () => {
    if (!memo || !onDelete) return
    onDelete(memo.id)
  }

  // Tabキーでインデントを挿入する処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault() // デフォルトのフォーカス移動を防止

      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      // 選択範囲がある場合の処理
      if (start !== end) {
        const selectedText = content.substring(start, end)
        const lines = selectedText.split("\n")

        // 複数行選択時、各行の先頭にタブを挿入
        if (lines.length > 1) {
          if (e.shiftKey) {
            // Shift+Tabでインデント削除
            const newLines = lines.map((line) => {
              if (line.startsWith("\t")) {
                return line.substring(1)
              } else if (line.startsWith("  ")) {
                return line.substring(2)
              }
              return line
            })
            const newText = newLines.join("\n")
            const newContent = content.substring(0, start) + newText + content.substring(end)
            setContent(newContent)

            // カーソル位置を調整
            setTimeout(() => {
              textarea.selectionStart = start
              textarea.selectionEnd = start + newText.length
            }, 0)
          } else {
            // Tabでインデント追加
            const newLines = lines.map((line) => "\t" + line)
            const newText = newLines.join("\n")
            const newContent = content.substring(0, start) + newText + content.substring(end)
            setContent(newContent)

            // カーソル位置を調整
            setTimeout(() => {
              textarea.selectionStart = start
              textarea.selectionEnd = start + newText.length
            }, 0)
          }
        } else {
          // 単一行選択時はタブを挿入
          const newContent = content.substring(0, start) + "\t" + content.substring(end)
          setContent(newContent)

          // カーソル位置を調整
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 1
          }, 0)
        }
      } else {
        // 選択範囲がない場合、カーソル位置にタブを挿入
        const newContent = content.substring(0, start) + "\t" + content.substring(end)
        setContent(newContent)

        // カーソル位置を調整
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1
        }, 0)
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1 flex items-center">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setAutoTitle(false)
            }}
            onBlur={() => { setIsFocused(false); handleBlur(); }}
            onFocus={() => setIsFocused(true)}
            placeholder="タイトル"
            className="text-lg font-medium border-none shadow-none focus-visible:ring-0"
          />
          {isSaving && (
            <div className="ml-2 text-muted-foreground flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              <span className="text-xs">保存中...</span>
            </div>
          )}
        </div>
        {!isNew && (
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">削除</span>
          </Button>
        )}
      </div>
      <Textarea
        ref={textareaRef}
        value={content || ""}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => { setIsFocused(false); handleBlur(); }}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder="ここにメモを入力..."
        className="flex-1 resize-none border-none p-4 focus-visible:ring-0 text-base font-mono"
      />
    </div>
  )
}
