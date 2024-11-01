import React, { useState, useEffect, useRef, } from "react";
//import { useParams, useNavigate } from "react-router-dom";
import {socket} from './../socket.mjs'
import AddComment from "./AddComment";
import utils from "../utils.mjs";
import {Comment, DocumentUpdateData} from './../functions/interface';

// interfase for element
interface OneDocumentProps {
    docType: string;
    username: string | null;
    docOwner: string | null;
    id: string;
    title: string;
    content: string;
    initialComments: Comment[];
    handleClose: () => void;
}

function OneDocument({docType, username, docOwner, id, title: intialTitle, content: initialContent, initialComments, handleClose }: OneDocumentProps) {
    // declare variabels and function to change them
    const [title, setTitle] = useState(intialTitle);
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false); // For submit state (optional)
  
    const [caretPosition, setCaretPosition] = useState({caret: 0, line: 0, x: 0, y: 0 });
    const [comments, setComments] = useState<Comment[]>(initialComments);

    // useEffect hook to manage socket connection and room creation
    useEffect(() => {
        // Connect the socket when the component mounts
        socket.connect();
     
        // Create a unique room ID
        const roomId = `${id}_${id}`; // Using owner ID and document ID for the room

        // Emit the create event to join the room
        socket.emit("create", roomId);

        // Listen for updates to the document title and content
        socket.on("documentUpdate", (data: DocumentUpdateData) => {
            setTitle(data.title);
            setContent(data.content);
        });

        // Listen for comments from other users
        socket.on("newComment", (data: Comment) => {
            handelSocketComment(data);
        });

        // Clean up the socket connection and listeners when the component unmounts
        return () => {
            socket.off('documentUpdate'); // Remove the document update listener
            socket.off('newComment'); // Remove the new comment listener
            socket.disconnect(); // Disconnect the socket
        };
    }, [docOwner, id]);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = event.target.value;
        setTitle(newTitle);
        
        // Emit the updated title and content to the server
        socket.emit("documentUpdate", { title: newTitle, content });
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = event.target.value;
        setContent(newContent);
        
        // Emit the updated title and content to the server
        socket.emit("documentUpdate", { title, content: newContent });
    };

    useEffect(() => {
       // Connect the socket when the component mounts
       socket.connect();

       // Listen for "content" event to update title and content from the server
       socket.on("content", () => {
           setTitle(title);
           setContent(content);
       });

       // Clean up the socket connection and listeners when the component unmounts
       return () => {
           socket.off('message'); // Remove the listener
           socket.off('content'); // Remove the content listener
           socket.disconnect(); // Disconnect the socket
       };
    }, []);

    const handelSocketComment = (data: any) => {
        if (data.comment) {
            const newComment: Comment = {
                author: data.comment.author,
                content: data.comment.content,
            };
            setComments((prevComments) => [...prevComments, newComment]);
        } else {
            const newComments: Comment[] = data.map((item: any) => ({
                author: item.author,
                content: item.content,
            }));
            setComments((prevComments) => [...prevComments, ...newComments]);
        }
    }

    const handleSubmitAndClose = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent page refresh
        setIsSubmitting(true);  // Set the submitting state to true (optional)

        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error("No token found in session storage. User may not be authenticated.");
            return;
        }
        let body;
        switch(docType){
            case "":
                body = JSON.stringify({
                    query: `mutation {
                        updateDoc(
                            username: "${username}",
                            inputid: "${id}",
                            title: "${title}",
                            content: "${content}"
                        ) {
                            _id
                            title
                            content
                        }
                    }`
                });
                break;
            case "shared/":
                body = JSON.stringify({
                    query: `mutation {
                        updateDoc(
                            username: "${docOwner}",
                            inputid: "${id}",
                            title: "${title}",
                            content: "${content}"
                        ) {
                            _id
                            title
                            content
                        }
                    }`
                });
                break;    
        }

        try {
            //WITH graphql
            
            const response1 = await utils.graphQL(body,token);
            if (!response1.ok) {
                console.error('Failed to update document:', response1.message);
                // Optionally, show error message in UI
                }
            // After the submission, go back to the list
            handleClose();
        } catch (error) {
            console.error('Failed to update document:', error);
        } finally {
            setIsSubmitting(false);  // Reset submitting state (optional)
        }
    };

    // element
    return (
        <> {/* wrap all in the one eleemnt */}
            <div className="comment_handler">
                <AddComment
                    user={username}
                    caretPosition={caretPosition}
                    socket={socket}
                    newComment={handelSocketComment}
                />
                <div className="comments">
                    {comments.map((comment, index) => (
                    <div className="comment" key={index}>
                        {/* <h3>
                        Rad {comment.row} | char {comment.caret}
                        </h3> */}
                        <h3>{comment.author}</h3>
                        <p>{comment.content}</p>
                    </div>
                    ))}
                </div>
            </div>
            <form className='doc form-wrapper' onSubmit={handleSubmitAndClose}> {/* change when the form submitted */}
                    <button type="submit" value="Submit" className='btn btn-primary change-collection' disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Save and close'}
                    </button>
                
                    <input type='hidden'name="id" value={id} />
                    <input className='title'
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Document Title"
                    />
                    <textarea className='content'
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Document Content"
                    />

                    {/* Combined Submit and Back to List button */}
                
            </form>
        </>
)};

export default OneDocument;
