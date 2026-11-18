'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
export const NotesPanel = () => {
  const [view, setView] = useState('list');
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const editorRef = useRef(null);
  useEffect(() => {
    if (view !== 'edit' || !activeNoteId) return;
    const interval = setInterval(() => {
      if (editorRef.current) {
        const updatedContent = editorRef.current.innerHTML;
        setNotes(prevNotes => prevNotes.map(note => note.id === activeNoteId ? {
          ...note,
          content: updatedContent,
          updatedAt: new Date()
        } : note));
        console.log('Auto-saved note:', activeNoteId);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [view, activeNoteId]);
  const createNewNote = () => {
    const newNote = {
      id: `note_${Date.now()}`,
      content: '',
      updatedAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setView('edit');
    setTimeout(() => {
      if (editorRef.current) editorRef.current.innerHTML = '';
    }, 0);
  };
  const selectNote = id => {
    const note = notes.find(n => n.id === id);
    setActiveNoteId(id);
    setView('edit');
    setTimeout(() => {
      if (editorRef.current && note) {
        editorRef.current.innerHTML = note.content;
      }
    }, 0);
  };
  const deleteNote = (id, e) => {
    e.stopPropagation();
    setNotes(prev => prev.filter(note => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
      setView('list');
    }
  };
  const clearAllNotes = () => {
    setNotes([]);
    setActiveNoteId(null);
    setView('list');
  };
  const formatText = command => {
    document.execCommand(command, false, undefined);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };
  return <div className="content-wrapper-right">
      <div className="right-content bg-faded d-flex flex-column h-100">
        <div className="flex-grow-1 p-3">
          <style>{`
        #note-content:empty:before {
          content: 'Start typing your note...';
          color: #999;
          font-style: italic;
          display: block;
          pointer-events: none;
        }
        .note-item {
          transition: all 0.2s ease;
          
        }
        .note-item .btn-outline-danger {
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        .note-item:hover .btn-outline-danger {
          opacity: 1;
        }
      `}</style>
          {view === 'list' && <div id="notes-list-view">
              <div id="notes-container" className="list-group">
                {notes.length === 0 ? <p className="text-center text-muted mt-4">
                    No notes yet. Create one by clicking the <u>New Note</u> button!
                  </p> : notes.map(note => <div key={note.id} className="note-item list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={() => selectNote(note.id)}>
                      <div className="text-truncate me-2 fs-sm fw-500 text-break" dangerouslySetInnerHTML={{
                __html: note.content || 'Untitled Note'
              }} />
                      <Button variant="outline-danger" size="sm" className="py-0 px-2 fs-xs" onClick={e => deleteNote(note.id, e)}>
                        <i className="fal fa-trash-alt" />
                      </Button>
                    </div>)}
              </div>

              <div className="d-flex justify-content-center gap-2 align-items-center mb-3 mt-3">
                <Button variant="outline-danger" size="sm" onClick={clearAllNotes} disabled={notes.length === 0}>
                  Clear Notes
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={createNewNote}>
                  Create New Note
                </Button>
              </div>
            </div>}

          {view === 'edit' && <div id="note-edit-view">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="outline-success" size="sm" onClick={() => setView('list')}>
                  Back
                </Button>

                <ButtonGroup size="sm" className="btn-group-xs">
                  <Button variant="outline-secondary" onClick={() => formatText('bold')} title="Bold (Ctrl+B)">
                    <i className="fal fa-bold" />
                  </Button>
                  <Button variant="outline-secondary" onClick={() => formatText('italic')} title="Italic (Ctrl+I)">
                    <i className="fal fa-italic" />
                  </Button>
                  <Button variant="outline-secondary" onClick={() => formatText('underline')} title="Underline (Ctrl+U)">
                    <i className="fal fa-underline" />
                  </Button>
                </ButtonGroup>
              </div>

              <div className="editor-container mb-3">
                <div id="note-content" ref={editorRef} className="info-container mb-3 border-faded p-3 rounded text-break" contentEditable="true" />
                <div className="fs-nano text-muted">
                  <i className="fal fa-check text-success" /> Auto save every 5 seconds
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default NotesPanel;