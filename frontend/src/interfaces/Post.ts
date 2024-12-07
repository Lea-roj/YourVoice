export interface Post {
  upvotes: number;
  downvotes: number;
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  reports: Array<{
    userId: {
      _id: string;
      username: string;
    };
    reportedAt: string;
    reason: { type: String };
  }>;
  userId: {
    _id: string;
    username: string;
  };
}
