import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../hooks/useAuth';
import ReactMarkdown from 'react-markdown';
import './HistoryPage.css';

const HistoryPage = ({ onBack }) => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, 'notes'),
          where('uid', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const notes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert timestamp to Date object for easier formatting, handle null if pending
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date() 
        }));
        setHistory(notes);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (selectedNote) {
    return (
      <div className="history-page">
        <div className="history-header-actions">
          <button className="action-btn" onClick={() => setSelectedNote(null)}>
            ← Back to History
          </button>
          <h2>{selectedNote.fileName}</h2>
        </div>
        <div className="notes-container history-notes-container">
          <div className="notes-content">
            <ReactMarkdown>{selectedNote.notes}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header-actions">
        <h2>Your Notes History</h2>
        <button className="btn-primary generate-new-btn" onClick={onBack}>
          Generate New +
        </button>
      </div>

      {loading ? (
        <div className="loading-container history-loading">
          <span className="loader"></span>
          <div className="loading-text">Loading your history...</div>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <h3>No notes yet</h3>
          <p>Upload your first PDF to get started!</p>
          <button className="btn-primary" onClick={onBack}>Upload PDF</button>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((note) => (
            <div key={note.id} className="history-card">
              <div className="history-card-icon">📄</div>
              <div className="history-card-content">
                <h3 className="history-card-title">{note.fileName}</h3>
                <p className="history-card-date">{formatDate(note.createdAt)}</p>
              </div>
              <button 
                className="btn-secondary view-notes-btn" 
                onClick={() => setSelectedNote(note)}
              >
                View Notes
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
