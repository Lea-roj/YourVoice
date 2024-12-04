export interface Post {
  upvotes: number;
  downvotes: number;
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  userId: {
    _id: string;
    username: string;
  };
}
