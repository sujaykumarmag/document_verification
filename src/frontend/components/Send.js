import { useState } from 'react'
import './App.css';
import { create } from 'ipfs-http-client'

// connect to the default API address http://localhost:5001

const client = create({ url: "http://127.0.0.1:5002/api/v0" });



// call Core API methods




function Send() {

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
        const result = await client.add(file);
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
            <>
                <h3>Upload file to IPFS</h3>
                <form onSubmit={onSubmitHandler}>
                    <input type="file" name="file" />
                    <button type="submit">Upload file</button>
                </form>
            </>
        </div>
    )
}

export default Send
