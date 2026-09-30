import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../api";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet(`/api/posts/${id}`).then(setPost).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="loader">Acces refuse : {error}</p>;
  if (!post) return <p className="loader">Chargement...</p>;

  return (
    <div className="post">
      <img src={post.img} alt="" className="postImg" />
      <h1 className="postTitle">{post.title}</h1>
      <p className="postDesc">{post.desc}</p>
      <p className="postLongDesc">{post.longDesc}</p>
    </div>
  );
};

export default Post;
