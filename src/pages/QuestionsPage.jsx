import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FiCopy, FiArrowLeft } from 'react-icons/fi';

const QuestionsPage = ({ file, onBack, questions, setQuestions, questionsFileRef }) => {
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState('');
  const questionsRef = useRef(null);

  useEffect(() => {
    if (file) {
      if (questions && questionsFileRef.current === file) {
        // Skip API call, we already have cached questions for this file
        return;
      }
      generateQuestions();
    }
  }, [file]);

  const generateQuestions = async () => {
    if (loadingQuestions) return;
    if (!file) return;
    
    setLoadingQuestions(true);
    setQuestions('');
    setQuestionsError('');
    
    const formData = new FormData();
    formData.append('pdf', file);
    
    try {
      const response = await axios.post('/api/generate-questions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setQuestions(response.data.questions);
      questionsFileRef.current = file;
    } catch (err) {
      console.error(err);
      if (err.response?.status === 429) {
        setQuestionsError('Daily free-tier limit reached (20 requests/day). Try again tomorrow or use a different API key.');
      } else {
        setQuestionsError(err.response?.data?.error || 'Failed to generate questions. Check if the questions server (port 5001) is running.');
      }
    } finally {
      setLoadingQuestions(false);
    }
  };

  return (
    <div className="history-page">
      <div className="history-header-actions">
        <h2>Practice Questions</h2>
        <button className="action-btn" onClick={onBack}>
          <FiArrowLeft style={{ marginRight: '0.5rem' }} /> Back to Notes
        </button>
      </div>

      <div className="notes-container" style={{ marginTop: '0' }}>
        <div className="notes-actions" style={{ justifyContent: 'flex-end' }}>
          {questions && (
            <button className="action-btn" onClick={() => navigator.clipboard.writeText(questions)}>
              <FiCopy /> Copy Questions
            </button>
          )}
        </div>

        {questionsError && <div className="error-message" style={{ margin: '1rem' }}>{questionsError}</div>}

        {loadingQuestions ? (
          <div className="loading-container">
            <span className="loader"></span>
            <div className="loading-text">Generating practice questions...</div>
          </div>
        ) : (
          <div className="notes-content" ref={questionsRef}>
            <ReactMarkdown>{questions}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsPage;
