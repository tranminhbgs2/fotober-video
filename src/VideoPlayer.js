import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom'; // Import useParams để lấy tham số URL

export function VideoPlayer() {
  const { order_id, video_id } = useParams(); // Lấy order_id và video_id từ URL
  const [videoUrl, setVideoUrl] = useState(null); // State để lưu trữ URL video
  const [orderInfo, setOrderInfo] = useState(null); // State để lưu thông tin đơn hàng

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`https://orders.fotober.com/api/get-video?order_id=${order_id}&video_id=${video_id}`);
        const text = await response.text(); // Lấy phản hồi dưới dạng văn bản
        
        const data = JSON.parse(text); // Chuyển đổi văn bản thành JSON
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setVideoUrl(data.data.link); // Lưu URL video
        setOrderInfo(data.data.order); // Lưu thông tin đơn hàng
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, [order_id, video_id]); // Gọi API mỗi khi order_id hoặc video_id thay đổi

  if (!videoUrl) {
    return <div>Loading...</div>; // Hiển thị loading trong khi lấy video
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
          <p><strong>Order ID:</strong> {orderInfo.id}</p>
          <p><strong>Name:</strong> {orderInfo.name}</p>
          <p><strong>Code:</strong> {orderInfo.code}</p>
          <p><strong>Cost:</strong> ${orderInfo.cost}</p>
          <p><strong>Status:</strong> {orderInfo.status}</p>
          <p><strong>Notes:</strong> {orderInfo.notes}</p>
        </div>
    </div>
  );
}
