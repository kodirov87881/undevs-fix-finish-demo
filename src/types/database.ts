export type Item = {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  created_at: string;
};

export type ItemInsert = {
  title: string;
  notes?: string | null;
};

export type Database = {
  public: {
    Tables: {
      items: {
        Row: Item;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
