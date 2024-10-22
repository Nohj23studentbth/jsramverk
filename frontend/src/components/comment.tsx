import React, { useState } from 'react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(comment);
    setComment("");
  };

  const handleClose = () => {
    onClose();
    setComment("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Write a Comment</h2>
        <textarea
          value={comment}
          className="modal-comment-area"
          onChange={(e) => setComment(e.target.value)}
          rows={5}
        />
        <div>
          <button
            onClick={handleClose}
            className="modal-button modal-button-cancel"
          >
            Cancel
          </button>
          <button onClick={handleSubmit} className="modal-button">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

interface AddCommentProps {
  caretPosition: { x: number; y: number }; // Adjust the type as needed
  socketRef: React.RefObject<any>; // Replace `any` with the specific socket type if known
  newComment: (commentData: { comment: string; caretPosition: { x: number; y: number } }) => void;
}

const AddComment: React.FC<AddCommentProps> = ({ caretPosition, socketRef, newComment }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleModalSubmit = (comment: string) => {
    console.log("Submitted comment:", comment);
    console.log("Cursors position was:", caretPosition);
    setModalOpen(false);
    socketRef.current.emit("comment", { comment, caretPosition });
    newComment({ comment, caretPosition });
  };

  return (
    <div className="modal-container">
      <button className="modal-comment-button" onClick={handleModalOpen}>
        Lägg till kommentar
      </button>
      <CommentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default AddComment;
