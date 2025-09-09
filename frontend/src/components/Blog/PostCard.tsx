import React, { useState, useEffect, useCallback } from 'react';
import { Post } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import EditPost from './EditPost';
import './Blog.css';

interface PostCardProps {
  post: Post;
  onPostDeleted: (postId: string) => void;
  onPostUpdated: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostDeleted, onPostUpdated }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchLikeData = useCallback(async () => {
    try {
      const [countData, statusData] = await Promise.all([
        apiService.getLikeCount(post.id),
        isAuthenticated ? apiService.getLikeStatus(post.id) : { isLiked: false }
      ]);
      setLikeCount(countData.count || 0);
      setIsLiked(statusData.isLiked || false);
    } catch (error) {
      console.error('Error fetching like data:', error);
    }
  }, [post.id, isAuthenticated]);

  useEffect(() => {
    fetchLikeData();
  }, [fetchLikeData]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }

    setIsLoading(true);
    try {
      await apiService.toggleLike(post.id);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error: any) {
      console.error('Error toggling like:', error);
      alert('Failed to update like');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await apiService.deletePost(post.id);
      onPostDeleted(post.id);
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="post-card">
      {showEditForm ? (
        <EditPost
          post={post}
          onPostUpdated={(updatedPost) => {
            onPostUpdated(updatedPost);
            setShowEditForm(false);
          }}
          onCancel={() => setShowEditForm(false)}
        />
      ) : (
        <>
          <div className="post-header">
            <div className="post-meta">
              <span className="post-date">{formatDate(post.createdAt)}</span>
              {isAdmin && (
                <div className="post-actions">
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <h2 className="post-title">{post.title}</h2>
          <p className="post-tagline">{post.tagLine}</p>
          <div className="post-body">{post.body}</div>

          <div className="post-footer">
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`like-btn ${isLiked ? 'liked' : ''}`}
            >
              <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
              <span className="like-count">{likeCount}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;