import React, { useState } from 'react';
import { UpdatePostData, Post } from '../../types';
import apiService from '../../services/api';
import './Blog.css';

interface EditPostProps {
  post: Post;
  onPostUpdated: (post: Post) => void;
  onCancel: () => void;
}

const EditPost: React.FC<EditPostProps> = ({ post, onPostUpdated, onCancel }) => {
  const [formData, setFormData] = useState<UpdatePostData>({
    title: post.title,
    tagLine: post.tagLine,
    body: post.body,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedPost = await apiService.updatePost(post.id, formData);
      onPostUpdated(updatedPost);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-post-form">
      <h3>Edit Post</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title (10-25 characters)</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={25}
          />
          <small className="char-count">{(formData.title || '').length}/25</small>
        </div>

        <div className="form-group">
          <label htmlFor="tagLine">Tag Line (10-70 characters)</label>
          <input
            type="text"
            id="tagLine"
            name="tagLine"
            value={formData.tagLine || ''}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={70}
          />
          <small className="char-count">{(formData.tagLine || '').length}/70</small>
        </div>

        <div className="form-group">
          <label htmlFor="body">Content (10-1000 characters)</label>
          <textarea
            id="body"
            name="body"
            value={formData.body || ''}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={1000}
            rows={8}
          />
          <small className="char-count">{(formData.body || '').length}/1000</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;