export interface Memo {
  id: string
  content: string | null
  created_at: string
  updated_at: string
}

export interface NewMemo {
  content: string | null
}
