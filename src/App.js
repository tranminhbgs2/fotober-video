import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { VideoPlayer } from './VideoPlayer'; // Import component VideoPlayer
import './App.css';

// Hàm kiểm tra trình duyệt
const isSupportedBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  // Danh sách các trình duyệt hỗ trợ
  const supportedBrowsers = ['chrome', 'firefox', 'safari', 'brave'];

  return supportedBrowsers.some(browser => userAgent.includes(browser));
};

// Hàm phát hiện DevTools đang mở
const isDevToolsOpen = () => {
  const threshold = 160;
  const widthDiff = window.outerWidth - window.innerWidth > threshold;
  const heightDiff = window.outerHeight - window.innerHeight > threshold;
  return widthDiff || heightDiff;
};

export function App(props) {
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);
  const [isDevToolsBlocked, setIsDevToolsBlocked] = useState(false);

  useEffect(() => {
    // Kiểm tra trình duyệt khi component được mount
    setIsBrowserSupported(isSupportedBrowser());

    const handleKeyDown = (event) => {
      // Ngăn phím F12 và Ctrl+U (Xem mã nguồn)
      if ((event.ctrlKey && (event.key === 'I' || event.key === 'U')) ||
        (event.ctrlKey && event.shiftKey && event.key === 'J') || 
        (event.metaKey && (event.key === 'I' || event.key === 'U')) ||
        event.key === 'F12') {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    
    // Kiểm tra ngay lập tức nếu DevTools đã mở
    if (isDevToolsOpen()) {
      setIsDevToolsBlocked(true);
      alert('DevTools is detected. Please close DevTools to access the site.');
    }

    const handleContextMenu = (event) => {
      // Ngăn menu chuột phải
      event.preventDefault();
    };
    const handleDevToolsDetection = () => {
      // Phát hiện nếu DevTools mở khi resize cửa sổ
      if (isDevToolsOpen()) {
        setIsDevToolsBlocked(true);
        alert('DevTools is detected. Please close DevTools to access the site.');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleDevToolsDetection);
    window.addEventListener('load', handleDevToolsDetection);

    // Cleanup các event listeners khi component bị unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleDevToolsDetection); // Bổ sung dòng này
      window.addEventListener('load', handleDevToolsDetection);
    };
  }, []);

  if (!isBrowserSupported) {
    return <div>Trình duyệt của bạn không được hỗ trợ để xem video này.</div>;
  }
  
  if (isDevToolsBlocked) {
    return <div>Vui lòng tắt DevTools để tiếp tục truy cập.</div>;
  }

  return (
    <Routes>
      <Route path="/video/:order_id/:video_id" element={<VideoPlayer />} />
      {/* Có thể thêm các route khác ở đây nếu cần */}
    </Routes>
  );
}

// Log to console
console.log('Hello console');


export default App;
