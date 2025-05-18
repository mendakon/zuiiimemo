export interface Memo {
  id: string
  title: string
  content: string | null
  created_at: string
  updated_at: string
}

export interface NewMemo {
  title: string
  content: string | null
}
