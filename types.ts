export interface Pin {
  id: number;
  imageUrl: string;
  title: string;
  user_id: string;
  description?: string;
  hashtags?: string;
}

export interface Comment {
  id: number;
  text: string;
  user: {
    username: string;
    avatar_url: string;
  };
}
