export default interface PostProps {
  post_id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  author: {
    user_id: string;
    name: string;
    username: string;
  };
}
