// PdfUpload : PdfUpload : Shows the user a preview of the selected PDF and returns the URL after uploading .
import React, { useState } from "react";
import { PdfUpload } from "react-ipfs-uploader";

const App = () => {
    const [ pdfUrl, setPdfUrl ] = useState("");

    return (
        <div>
            <PdfUpload setUrl={setPdfUrl} />
            Pdfurl :{" "}
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                {pdfUrl}
            </a>
        </div>
    );
};

export default App;
