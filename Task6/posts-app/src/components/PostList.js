import React from 'react';

export default function PostList({ posts, onEdit, onDelete }) {
  return (
    <div>
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button onClick={() => onEdit(post)} style={{ marginRight: '1rem' }}>
              Edit
            </button>
            <button onClick={() => onDelete(post.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}