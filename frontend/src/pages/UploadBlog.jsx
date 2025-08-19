import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import JoditEditor from 'jodit-react';
import { api_base_url } from '../helper';

const UploadBlog = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');

  const checkAdmin = () => {
    if (adminSecret !== "") {
      if (adminSecret === "admin1234") {
        setIsAdmin(true);
      } else {
        setError("Invalid admin secret !");
      }
    } else {
      setError("Please provide admin secret !");
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("token", localStorage.getItem("token"));

    fetch(api_base_url + "/uploadBlog", {
      mode: "cors",
      method: "POST",
      body: formData,
    }).then((res) => res.json()).then(data => {
      if (data.success) {
        alert("Blog created successfully");
        setTitle("");
        setDesc("");
        setContent("");
        setImage("");
        setError("");
      } else {
        setError(data.msg);
      }
    });
  };

  const generateContent = () => {
    fetch(api_base_url + "/generate", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt
      })
    }).then(res => res.json()).then(data => {
      setContent(data.content);
    });
  };

  return (
    <>
      {
        isAdmin == false ?
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-lg border border-gray-700">
              <h3 className="text-2xl font-semibold text-white text-center mb-6">
                Admin Login
              </h3>
              <div className="mb-4">
                <input
                  onChange={(e) => setAdminSecret(e.target.value)}
                  value={adminSecret}
                  type="password"
                  placeholder="Enter admin secret"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm mb-3">{error}</p>
              )}
              <button
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium"
                onClick={checkAdmin}
              >
                Login
              </button>
            </div>
          </div> : <>
            <Navbar />
            <div className='px-[100px]'>
              <h3>Upload Blog</h3>
              <div className="inputBox mt-3">
                <input
                  type="text"
                  placeholder="Enter a prompt to generate content with AI"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button className="btnNormal" onClick={generateContent}>Generate</button>
              </div>
              <form onSubmit={submitForm}>
                <div className="inputBox mt-3">
                  <input onChange={(e) => { setTitle(e.target.value) }} value={title} type="text" placeholder='Enter title' />
                </div>
                <div className="inputBox">
                  <textarea onChange={(e) => { setDesc(e.target.value) }} value={desc} placeholder='Enter Descriptin'></textarea>
                </div>
                <JoditEditor
                  ref={editor}
                  className='text-black mt-2'
                  value={content}
                  tabIndex={1} // tabIndex of textarea
                  onChange={newContent => setContent(newContent)}
                />
                <input type="file" className='my-3' onChange={(e) => { setImage(e.target.files[0]) }} id='file' /> <br />
                <button className="btnNormal mt-3">Create Blog</button>
              </form>
            </div>
          </>
      }
    </>
  );
};

export default UploadBlog;