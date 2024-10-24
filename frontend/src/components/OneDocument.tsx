import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import AddComment from "./comment";
import {socket} from "../socket.mjs";
import utils from '../utils.mjs';

interface OneDocumentProps {
  username: string | null;
  id: string;
  title: string;
  content: string;
  handleClose: () => void;
}

interface Comment {
  comment: string;
  caret: number;
  row: number;
}

interface ServerData {
  data: FormData;
}

interface SocketUpdateData {
  title: string;
  content: string;
}

function Document() {

  // function OneDocument({username, id, title: intialTitle, content: initialContent, handleClose }: OneDocumentProps) {
  //   const SERVER_URL = "http://localhost:3000";
  //   // declare variabels and function to change them
  //   const [title, setTitle] = useState(intialTitle);
  //   const [content, setContent] = useState(initialContent);
  //   const [isSubmitting, setIsSubmitting] = useState(false); // For submit state (optional)
  //   //const [contentEvent, setContentEven] = useState(ContentEvent)
    
  //   useEffect(() => {
  //      // Connect the socket when the component mounts
  //      socket.connect();

  //      // Listen for "content" event to update title and content from the server
  //      socket.on("content", (data: ContentEvent) => {
  //          setTitle(title);
  //          setContent(content);
  //      });
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
  });
  const [caretPosition, setCaretPosition] = useState({ caret: 0, line: 0 });
  const [comments, setComments] = useState<Comment[]>([]);

  const { id } = useParams<{ id: string }>(); // Explicit typing for useParams
  const navigate = useNavigate();

  const currentPath =
    process.env.NODE_ENV === "production"
      ? "https://jsramverk-oleg22-g9exhtecg0d2cda5.northeurope-01.azurewebsites.net/"
      : "http://localhost:3000";

  const socketRef = useRef<Socket | null>(null); // Add type for socketRef

  const handelSocketUpdate = (update: string, data: SocketUpdateData) => {
    const path = update === "socketJoin" ? data : data;

    setFormData({
      title: path.title,
      content: path.content,
    });
  };

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

  useEffect(() => {
    socketRef.current = io(currentPath);
    socketRef.current.emit("create", id);

    socketRef.current.on("serverUpdate", (data: SocketUpdateData) =>
      handelSocketUpdate("serverUpdate", data)
    );

    socketRef.current.on("socketJoin", (data: SocketUpdateData) =>
      handelSocketUpdate("socketJoin", data)
    );

    socketRef.current.on("newComment", (data: any) => {
      handelSocketComment(data);
    });

    fetch(`${currentPath}/docs/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("An Error has occurred");
        }
        return response.json();
      })
      .then((data: ServerData) => {
        setFormData({
          title: data.data.title || "",
          content: data.data.content || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    socketRef.current?.emit("update", {
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${currentPath}/docs/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCarotMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const value = target.value;
    const caretPosition = target.selectionStart;
    const lineNumber = value.substring(0, caretPosition).split("\n").length;

    const caretPositionInLine =
      lineNumber === 1
        ? caretPosition
        : caretPosition - (value.lastIndexOf("\n", caretPosition - 1) + 1);

    setCaretPosition({ caret: caretPositionInLine, line: lineNumber });
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="document-bg">
      <AddComment
        caretPosition={caretPosition}
        socketRef={socketRef}
        newComment={handelSocketComment}
      />
      <form onSubmit={handleSubmit} className="new-doc">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          className="title-input"
          value={formData.title}
          onChange={handleChange}
        />

        <input type="hidden" name="id" value={id} />

        <label htmlFor="content">Innehåll</label>
        <textarea
          name="content"
          className="content-input input-width"
          value={formData.content}
          onChange={handleChange}
          onClick={handleCarotMove}
        />

        <input className="button-create" type="submit" value="Uppdatera" />
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
    </div>
  );
}

export default Document;
