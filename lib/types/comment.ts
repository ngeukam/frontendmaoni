export interface IComment {
    id: string;
    review_id: string;
    user_id?: string | null;
    text?: string;
    created_at?: string;
    updated_at?: string;
  }