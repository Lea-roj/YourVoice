export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  role: 'user' | 'moderator' | 'admin'; // Add the role property with its enum values
}
