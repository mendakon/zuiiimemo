"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import type { Memo } from "@/types"
import { updateMemo, createMemo } from "@/app/actions"
import { Textarea } from "@/components/ui/textarea"

interface MemoEditorProps {
  memo?: Memo
  isNew?: boolean
  onSave?: (memo: Memo) => void
  onDelete?: (id: string) => void
  onSavingChange?: (isSaving: boolean) => void
}

export function MemoEditor({ memo, isNew = false, onSave, onSavingChange }: MemoEditorProps) {
  const [content, setContent] = useState(memo?.content || "")
  const [, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 初期値を保存して変更を検出するための参照
  const initialContentRef = useRef(memo?.content || "")

  // メモが変更されたときにコンテンツを更新
  useEffect(() => {
    setContent(memo?.content || "")
    initialContentRef.current = memo?.content || ""
  }, [memo])

  useEffect(() => {
    if (isNew && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isNew])

  // 変更を検出
  useEffect(() => {
    const contentChanged = content !== initialContentRef.current
    setHasChanges(contentChanged)
  }, [content])

  // 自動保存処理
  const saveChanges = useCallback(async () => {
    if (!hasChanges || !content) return

    setIsSaving(true)
    onSavingChange?.(true)
    try {
      let savedMemo

      if (isNew) {
        savedMemo = await createMemo({ content })
        if (savedMemo) {
          initialContentRef.current = savedMemo.content || ""
          setHasChanges(false)
        }
      } else if (memo) {
        savedMemo = await updateMemo(memo.id, { content })
        if (savedMemo) {
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
      onSavingChange?.(false)
    }
  }, [content, hasChanges, isNew, memo, onSave, onSavingChange])

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
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="ここにメモを入力..."
        className="flex-1 resize-none border-none p-4 focus-visible:ring-0 text-base font-mono"
      />
    </div>
  )
}
