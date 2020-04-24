import React, { useState } from "react";

type RemoteData<E, D> =
  | { type: "NOT_ASKED" }
  | { type: "LOADING" }
  | { type: "FAILURE"; error: E }
  | { type: "SUCCESS"; data: D };

function foldRemoteData<R, E, D>(
  remoteData: RemoteData<E, D>,
  notAsked: () => R,
  loading: () => R,
  failure: (error: E) => R,
  success: (data: D) => R
): R {
  switch (remoteData.type) {
    case "NOT_ASKED":
      return notAsked();
    case "LOADING":
      return loading();
    case "FAILURE":
      return failure(remoteData.error);
    case "SUCCESS":
      return success(remoteData.data);
  }
}

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

  return foldRemoteData(
    posts,
    () => (
      <div style={{ textAlign: "center" }}>
        <div>Not asked for posts yet</div>
        <button onClick={getPosts}>Fetch Posts</button>
      </div>
    ),
    () => <p>Loading....</p>,
    (error) => <p>{error}</p>,
    (data) => <pre>{JSON.stringify(data, null, 2)}</pre>
  );
}

export default App;
