export type Post = {
  id: number;
  user: string;
  avatar: any;
  image: any;
  caption: string;
  likes: number;
  comments: number;
};

export const posts: Post[] = [
  {
    id: 1,
    user: 'Sher Singh',
    avatar: require('./assets/images/man2.jpg'),
    image: require('./assets/images/man2.jpg'),
    caption: 'Partial React, full happiness!',
    likes: 98,
    comments: 8,
  },
  {
    id: 2,
    user: 'Jamal Khan',
    avatar: require('./assets/images/man1.jpg'),
    image: require('./assets/images/man1.jpg'),
    caption: 'Enjoying the React journey! 🚀',
    likes: 120,
    comments: 15,
  },
  
  {
    id: 3,
    user: 'Bob Johnson',
    avatar: require('./assets/images/man3.jpg'),
    image: require('./assets/images/man3.jpg'),
    caption: 'Splashing into new projects!',
    likes: 76,
    comments: 12,
  },
];
