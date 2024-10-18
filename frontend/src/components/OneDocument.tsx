//<<<<<<< HEAD
//import React, { useEffect, useRef, useState } from 'react';
//=======
import React, { useState, useEffect, useRef } from 'react';
import {socket} from "../socket.mjs";
//>>>>>>> Socket
import utils from '../utils.mjs';
// import io from "socket.io-client"; 
// import { Socket } from "socket.io-client"; 


// interfase for element
interface OneDocumentProps {
    id: string;
    title: string;
    content: string;
    handleClose: () => void;
}


function OneDocument({ id, title: intialTitle, content: initialContent, handleClose }: OneDocumentProps) {
    const SERVER_URL = "http://localhost:3000";
    // declare variabels and function to change them
    const [title, setTitle] = useState(intialTitle);
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false); // For submit state (optional)

    const [username, setUsername] = useState(localStorage.getItem('username'));
    //const [passwod, setPasswod] = useState(localStorage.getItem('passwod'));

    useEffect(() => {
       // Connect the socket when the component mounts
       socket.connect();

       // Listen for "content" event to update title and content from the server
       socket.on("content", ({ title, content }) => {
           setTitle(title);
           setContent(content);
       });

       // Clean up the socket connection and listeners when the component unmounts
       return () => {
           //socket.off('message'); // Remove the listener
           socket.off('content'); // Remove the content listener
           socket.disconnect(); // Disconnect the socket
       };
    }, []);

    const handleSubmitAndClose = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent page refresh
        setIsSubmitting(true);  // Set the submitting state to true (optional)

        // Updated document object
        const body = {
                        username: username, 
                        id, 
                        title, 
                        content
                    };

        try {
            // Submit the document update to the backend
            await utils.processRoute('PUT', 
                                        `/data/update`, 
                                        body);

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
            <form className='doc' onSubmit={handleSubmitAndClose}> {/* change when the form submitted */}
                <input type='hidden'name="id" value={id} />
                <input className='title'
                    type="text"
                    name="newTitle"
                    value={title}
                    onChange={(e) => 
                        setTitle(e.target.value)}>
                </input>
                
                <input className='content'
                    type="text"
                    name="newContent"
                    value={content}
                    onChange={(e) => 
                        setContent(e.target.value)}>
                </input>

                {/* Combined Submit and Back to List button */}
                <button type="submit" value="Submit" className='btn btn-primary change-collection' disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Save and close'}
                </button>
            </form>
            <h1>{title}</h1>
            <p>{content}</p>
            
        </>
)};

export default OneDocument;