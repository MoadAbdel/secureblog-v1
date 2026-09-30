import { useEffect, useState } from "react";
import Card from "../components/Card";
import { apiGet } from "../api";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    apiGet("/api/posts").then(setPosts).catch(() => setPosts([]));
  }, []);

  return (
    <div className="home">
      {posts.map((post) => (
        <Card key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;
