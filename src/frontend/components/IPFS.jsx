import { useState } from 'react'
import { ipfsClient } from "ipfs-http-client";
import './App.css';

// insert your infura project crediental you can find 
// easily these your infura account in API key management section
const projectId = "2HMraZeW6Zh7lYIIR7e57SJ7d7O"
const projectSecretKey = "e15efab3e919826630815c4f790e7b53"
xhr.setRequestHeader("Authorization", "Basic " + window.btoa(projectId + ":" + projectSecretKey))


function App() {

    const [ images, setImages ] = useState([])
   

    
    const onSubmitHandler = async (event) => {
        
        event.preventDefault();
        const form = event.target;
        const files = (form[ 0 ]).files;

        if (!files || files.length === 0) {
            return alert("No files selected");
        }

        const file = files[ 0 ];
        // upload files

        let req = https.request(options, (res) => {
            let body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                console.log(body);
            });
        });
        req.end();


        setImages([
            ...images,
            {
                cid: result.cid,
                path: result.path,
            },
        ]);

        form.reset();
    };

    return (
        <div className="App">
            {ipfs && (
                <>
                    <h3>Upload file to IPFS</h3>
                    <form onSubmit={onSubmitHandler}>
                        <input type="file" name="file" />
                        <button type="submit">Upload file</button>
                    </form>
                </>
            )}
            <div>
                {images.map((image, index) => (
                    <img
                        alt={`Uploaded #${index + 1}`}
                        src={"https://skywalker.infura-ipfs.io/ipfs/" + image.path}
                        style={{ maxWidth: "400px", margin: "15px" }}
                        key={image.cid.toString() + index}
                    />
                ))}
            </div>
        </div>
    )
}

export default App
