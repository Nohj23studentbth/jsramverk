import React, { useState, useEffect, useRef, } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {socket} from './../socket.mjs'
import AddComment from "./AddComment";
import utils from "../utils.mjs";
//import CommentInterface from './../functions/interface';

// Define the shape of formData and comments
interface FormData {
  title: string;
  content: string;
}

interface Comment {
  comment: string;
  caret: number;
  row: number;
}

interface ServerData {
  data: FormData;
}

interface DocumentUpdateData {
    title: string;
    content: string;
}

interface SocketUpdateData {
  title: string;
  content: string;
}

// interfase for element
interface OneDocumentProps {
    docType: string;
    username: string | null;
    docOwner: string | null;
    id: string;
    title: string;
    content: string;
    handleClose: () => void;
}


function OneDocument({docType, username, docOwner, id, title: intialTitle, content: initialContent, handleClose }: OneDocumentProps) {
    //const SERVER_URL = "http://localhost:3000";
    // declare variabels and function to change them
    const [title, setTitle] = useState(intialTitle);
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false); // For submit state (optional)
    const [formData, setFormData] = useState<FormData>({
      title: "",
      content: "",
    });
    const [caretPosition, setCaretPosition] = useState({caret: 0, line: 0, x: 0, y: 0 });
    const [comments, setComments] = useState<Comment[]>([]);
  
    //const { id } = useParams<{ id: string }>(); // Explicit typing for useParams
    const navigate = useNavigate();
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

  
    // const currentPath =
    //   process.env.NODE_ENV === "production"
    //     ? "https://jsramverk-oleg22-g9exhtecg0d2cda5.northeurope-01.azurewebsites.net/"
    //     : "http://localhost:3000";
  
    //const socketRef = useRef<typeof Socket | null>(null); // Add type for socketRef
  
    // const handelSocketUpdate = (update: string, data: SocketUpdateData) => {
    //   const path = update === "socketJoin" ? data : data;
  
      
    //   setFormData({
    //     title: path.title,
    //     content: path.content,
    //   });
    // };
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
          setComments((prevComments) => [
            ...prevComments,
            {
              comment: data.comment,
              caret: data.caretPosition.caret,
              row: data.caretPosition.line,
            },
          ]);
        } else {
          setComments((prevComments) => [...prevComments, ...data]);
        }
      };

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

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //       ...formData,
    //       [name]: value,
    //     });
    
    //     socket.emit("update", {
    //       ...formData,
    //       [name]: value,
    //     });
    // };

    const handleCarotMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        const value = target.value;
        const caretPosition = target.selectionStart;
        const lineNumber = value.substring(0, caretPosition).split("\n").length;
    
        const caretPositionInLine =
          lineNumber === 1
            ? caretPosition
            : caretPosition - (value.lastIndexOf("\n", caretPosition - 1) + 1);
    
        const x = e.clientX; // Example using mouse event coordinates
        const y = e.clientY;
        setCaretPosition({ caret: caretPositionInLine, line: lineNumber, x:x, y:y });
      };
    // element
    return (
        <> {/* wrap all in the one eleemnt */}
            <AddComment
                caretPosition={caretPosition}
                socket={socket}
                newComment={handelSocketComment}
            />
            <form className='doc' onSubmit={handleSubmitAndClose}> {/* change when the form submitted */}
                <div className='button-div'>
                    <button type="submit" value="Submit" className='btn btn-primary change-collection' disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Save and close'}
                    </button>
                </div>
                <div className='input-div'>
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
                </div>
            </form>
            <div>
                {comments.map((comment, index) => (
                <div className="comment" key={index}>
                    <h3>
                    Rad {comment.row} | char {comment.caret}
                    </h3>
                    <p>{comment.comment}</p>
                </div>
                ))}
            </div>
            
        </>
)};

export default OneDocument;
