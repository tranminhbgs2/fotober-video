import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom'; // Import useParams để lấy tham số URL

export function VideoPlayer() {
  let isDevTool = false;
  const { order_id, video_id } = useParams(); // Lấy order_id và video_id từ URL
  const [videoUrl, setVideoUrl] = useState(null); // State để lưu trữ URL video
  const [orderInfo, setOrderInfo] = useState(null); // State để lưu thông tin đơn hàng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  
  function onDevToolsOpen() {
    isDevTool = true;
  }
  class DevToolsChecker extends Error {
    toString() {
  
    }
    get message() {
        onDevToolsOpen();
    }
  }
  console.log(new DevToolsChecker());
  useEffect(() => {
    if (order_id && video_id && !isDevTool) {
      const fetchVideo = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get-video?order_id=${order_id}&video_id=${video_id}`);
          const text = await response.text(); // Lấy phản hồi dưới dạng văn bản
          
          const data = JSON.parse(text); // Chuyển đổi văn bản thành JSON
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          setVideoUrl(data.data.link); // Lưu URL video
          console.log(data.data.link);
          setOrderInfo(data.data.order); // Lưu thông tin đơn hàng
          setLoading(false); // Nếu DevTools mở thì không cần loading
        } catch (error) {
          // console.error('Error fetching video:', error);
        }
      };
      fetchVideo();
    } else {
      setLoading(false); // Nếu DevTools mở thì không cần loading
    }
  }, [order_id, video_id]); // Gọi API mỗi khi order_id hoặc video_id thay đổi

  if (isDevTool) {
    return <h1 >DevTools is open. Access is blocked.</h1>; // Hiển thị trạng thái loading
  }
  
  if (loading) {
    return <div>Loading video...</div>; // Hiển thị trạng thái loading
  }else if (!videoUrl) {
    return <div>No video data found.</div>; // Nếu không có dữ liệu
  }

  return (
    <div className="video-wrapper">
      <ReactPlayer
        url={videoUrl} // Sử dụng URL video từ API
        className="react-player"
        controls={true}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              onContextMenu: e => e.preventDefault(),
            }
          }
        }}
      />
        <div className="order-info">
          <h3>Order Information</h3>
          <p><strong>Name:</strong> {orderInfo.name}</p>
          <p><strong>Code:</strong> {orderInfo.code}</p>
          <p><strong>Notes:</strong> {orderInfo.notes}</p>
        </div>
    </div>
  );
}
