import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom'; // Import useParams để lấy tham số URL
import axios from 'axios'; // Import axios

export function VideoPlayer() {
  const { order_id, video_id } = useParams(); // Lấy order_id và video_id từ URL
  const [videoUrl, setVideoUrl] = useState(null); // State để lưu trữ URL video

  useEffect(() => {
    const fetchVideo = async () => {
      const url = `https://orders.fotober.com/api/get-video?order_id=${order_id}&video_id=${video_id}`;
      console.log('Fetching from URL:', url);

      try {
        const response = await axios.get(url);
        console.log('API Response:', response.data); // Ghi lại phản hồi
        // Lấy link video từ data
        setVideoUrl(data.data.link); // Sử dụng link từ dữ liệu API
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
        width="100%"
        height="100%"
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
    </div>
  );
}
