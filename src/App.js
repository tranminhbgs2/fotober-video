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

export function App(props) {
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);

  useEffect(() => {
    // Kiểm tra trình duyệt khi component được mount
    setIsBrowserSupported(isSupportedBrowser());

    const handleKeyDown = (event) => {
      // Ngăn phím F12 và Ctrl+U (Xem mã nguồn)
      if ((event.ctrlKey && (event.key === 'I' || event.key === 'U')) ||
        (event.metaKey && (event.key === 'I' || event.key === 'U')) ||
        event.key === 'F12') {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleDevToolsDetection = () => {
      // Kỹ thuật phát hiện DevTools mở
      const isDevToolsOpen = window.outerHeight - window.innerHeight > 100 ||
        window.outerWidth - window.innerWidth > 100;
      if (isDevToolsOpen) {
        alert('DevTools is detected. Please close DevTools to continue.');
        // Optionally restrict access or redirect
      }
    };

    const handleContextMenu = (event) => {
      // Ngăn menu chuột phải
      event.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    // document.addEventListener('keydown', handleKeyDown);
    // window.addEventListener('resize', handleDevToolsDetection);

    // Cleanup các event listeners khi component bị unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      // document.removeEventListener('keydown', handleKeyDown);
      // window.removeEventListener('resize', handleDevToolsDetection); // Bổ sung dòng này
    };
  }, []);

  if (!isBrowserSupported) {
    return <div>Trình duyệt của bạn không được hỗ trợ để xem video này.</div>;
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
