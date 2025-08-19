import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { api_base_url } from '../helper';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

const SingleBlog = () => {
  const [data, setData] = useState(null);
  const [image, setImage] = useState("");
  const [summary, setSummary] = useState("");
  let { blogId } = useParams();

  const getBlog = () => {
    fetch(api_base_url + "/getBlog", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        blogId: blogId,
        token: localStorage.getItem("token")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setData(data.blog);
        setImage(data.blog.image);
      } else {
        alert(data.msg);
      }
    });
  };

  const summarizeBlog = () => {
    fetch(api_base_url + "/summarize", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: data.content
      })
    }).then(res => res.json()).then(data => {
      setSummary(data.summary);
    });
  };

  useEffect(() => {
    getBlog();
  }, []);

  return (
    <>
      <Navbar />
      <div className="single-blog px-[100px] mt-4">
        <div className="flex w-full min-h-[400px] pt-5">
          <div className="left w-[40%] h-full">
            <img className='w-full rounded-lg' src={"http://localhost:3000/uploads/" + image} alt="" />
          </div>
          <div className='ml-4'>
            <h3 className='text-3xl font-[500]'>{data ? data.title : ""}</h3>
            <p className='text-[gray] text-[14px] mt-3 mb-3'>Created : {data ? new Date(data.date).toDateString() : ""}</p>
            <b>Description</b>
            <p className='text-[gray] text-[14px]'>{data ? data.desc : ""}</p>
            <button onClick={summarizeBlog} className="btnNormal mt-3">Summarize with AI</button>
            {summary && (
              <div className="summary mt-4">
                <h4 className="text-xl font-bold">Summary:</h4>
                <p className="text-[gray] text-[14px]">{summary}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          {
            data ? parse(data.content) : ""
          }
        </div>
      </div>
    </>
  );
};

export default SingleBlog;