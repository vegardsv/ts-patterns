import React, { useState } from "react";

type RemoteData<E, D> =
  | { type: "NOT_ASKED" }
  | { type: "LOADING" }
  | { type: "FAILURE"; error: E }
  | { type: "SUCCESS"; data: D };

interface Post {
  id: string;
  title: string;
  body: string;
}

async function fetchPosts(): Promise<RemoteData<Error, Post[]>> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw await response.json();
    const data = await response.json();
    return { type: "SUCCESS", data: data };
  } catch (e) {
    return { type: "FAILURE", error: e };
  }
}

function App(): JSX.Element {
  const [posts, setPosts] = useState<RemoteData<Error, Post[]>>({
    type: "NOT_ASKED",
  });

  const getPosts = () => {
    setPosts({ type: "LOADING" });
    fetchPosts().then((remoteData) => setPosts(remoteData));
  };
  switch (posts.type) {
    case "NOT_ASKED":
      return (
        <div style={{ textAlign: "center" }}>
          <div>Not asked for posts yet</div>
          <button onClick={getPosts}>Fetch Posts</button>
        </div>
      );
    case "LOADING":
      return <div>Loading</div>;
    case "FAILURE":
      return <div>Something went wrong 😨</div>;
    case "SUCCESS":
      return (
        <div>
          {posts.data.map((post) => (
            <article
              key={post.id}
              style={{
                border: "1px solid darkgray",
                margin: "1rem",
                padding: "1rem",
              }}
            >
              <h2>{post.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
            </article>
          ))}
        </div>
      );
  }
}

export default App;
