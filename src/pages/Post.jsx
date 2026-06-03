import React, { useState } from 'react';

const Post = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // basic validation
    if (!text && !image) {
      alert("Please add some text or an image.");
      return;
    }

    setLoading(true);

    // 1. Prepare Multipart Form Data
    const formData = new FormData();
    formData.append('content', text); // Must match 'content' in Django Serializer
    if (image) {
      formData.append('image', image); // Must match 'image' in Django Serializer
    }

    // 2. Retrieve JWT Token (Assuming it's stored in localStorage)
    const token = localStorage.getItem('access'); 

    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts/create/', {
        method: 'POST',
        // headers: {
          // If your backend is protected by JWT, this is mandatory
          // 'Authorization': `Bearer ${token}`,
          // WARNING: Do NOT set 'Content-Type'. The browser handles it for FormData.
        // },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Post successful:', data);
        alert('Post published!');
        setText('');
        setImage(null);
        // Reset the file input manually if needed
        document.getElementById('imageInput').value = '';
      } else {
        // Log backend validation errors (e.g., "This field is required")
        console.error('Backend Error Details:', data);
        alert(`Error: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Network/Connection Error:', error);
      alert('Could not connect to the server. Check if Django is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>New Post</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Attachment</label>
          <input 
            id="imageInput"
            type="file" 
            accept="image/*" 
            onChange={(e) => setImage(e.target.files[0])} 
            style={styles.fileInput}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Content / Code</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your code or write a description..."
            style={styles.textarea}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...styles.button, 
            backgroundColor: loading ? '#a0aec0' : '#4a90e2',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Uploading...' : 'Post to Feed'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { 
    maxWidth: '500px', 
    margin: '40px auto', 
    padding: '25px', 
    backgroundColor: '#fff',
    borderRadius: '12px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
  },
  title: { marginTop: 0, color: '#333', fontSize: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: '600', fontSize: '0.85rem', color: '#555', textTransform: 'uppercase' },
  fileInput: { padding: '8px', border: '1px dashed #cbd5e0', borderRadius: '6px' },
  textarea: { 
    height: '180px', 
    padding: '12px', 
    fontFamily: '"Fira Code", monospace', 
    fontSize: '13px', 
    lineHeight: '1.5',
    borderRadius: '6px', 
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    resize: 'vertical'
  },
  button: { 
    padding: '12px', 
    color: 'white', 
    border: 'none', 
    borderRadius: '6px', 
    fontWeight: 'bold', 
    fontSize: '1rem',
    transition: 'background 0.2s'
  }
};
export default Post;