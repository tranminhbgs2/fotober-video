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
function onDevTools () {
  setTimeout(() => {
    console.log('DevTools is open')
      // alert('DevTools is detected. Please close DevTools to access the site.');
        // window.location.reload(); // Tự động reload lại trang
      // Ẩn hoặc khóa giao diện nếu DevTools mở
      document.body.innerHTML = "<h1>DevTools is open. Access is blocked.</h1>";
  }, 10);
}
class DevToolsChecker extends Error {
  get message() {
    onDevTools();
    return '';
  }
}
export function App(props) {
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);
// Function to detect if DevTools is open
const detectDevTools = () => {
  let detected = false;
  const start = new Date();
  debugger; // This will pause execution when DevTools is open
  const end = new Date();
  
  if (end - start > 100) {
    detected = true;
  }
  setDevToolsOpen(detected); 
  if (detected) {
    throw new DevToolsChecker();
  }
};
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
    

    const handleContextMenu = (event) => {
      // Ngăn menu chuột phải
      event.preventDefault();
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(detectDevTools, 1000); // Check every second
    // Cleanup các event listeners khi component bị unmount
    return () => {
      clearInterval(interval);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isBrowserSupported) {
    return <div>Your browser is not supported to view this video.</div>;
  }
  
  if (devToolsOpen) {
    if (devToolsOpen) {
      return <div>Please disable DevTools to continue accessing the site.</div>;
    }
  }

  return (
    
    <Routes>
      <Route path="/video/:order_id/:video_id" element={<VideoPlayer  />} />
      {/* Có thể thêm các route khác ở đây nếu cần */}
    </Routes>
  );
}


export default App;
