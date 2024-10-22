import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Document {
  _id: string;
  title: string;
}

interface DocumentResponse {
  data: Document[];
}

const AllDocuments: React.FC = () => {
  const [data, setData] = useState<DocumentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const currentPath =
    process.env.NODE_ENV === "production"
      ? "https://jsramverk-oleg22-g9exhtecg0d2cda5.northeurope-01.azurewebsites.net/"
      : "http://localhost:3000";

  useEffect(() => {
    fetch(`${currentPath}/docs`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("An Error has occurred");
        }
        return response.json();
      })
      .then((data: DocumentResponse) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="docs-container">
      {data && data.data.map((item) => (
        <Link className="doc-link" to={`document/${item._id}`} key={item._id}>
          <div>
            <div className="doc"></div>
            <h3>{item.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AllDocuments;
