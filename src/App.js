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
  setTimeout(console.clear.bind(console))
  setTimeout(() => {
    console.log('DevTools is open')
      alert('DevTools is detected. Please close DevTools to access the site.');
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
  const [isDevToolsBlocked, setIsDevToolsBlocked] = useState(false);

  useEffect(() => {
    // Kiểm tra trình duyệt khi component được mount
    setIsBrowserSupported(isSupportedBrowser());
    // Kiểm tra DevTools thông qua console.log
    const detectDevTools = () => {
      const devToolsChecker = new DevToolsChecker();
      console.log(devToolsChecker);
    };

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
    console.log('DevTools is open1')
      setIsDevToolsBlocked(true);
        onDevTools(); // Gọi hàm cảnh báo khi phát hiện
      alert('DevTools is detected. Please close DevTools to access the site0.');
    }

    const handleContextMenu = (event) => {
      // Ngăn menu chuột phải
      event.preventDefault();
    };
    const handleDevToolsDetection = () => {
      // Phát hiện nếu DevTools mở khi resize cửa sổ
      if (isDevToolsOpen()) {
        setIsDevToolsBlocked(true);
        alert('DevTools is detected. Please close DevTools to access the site1.');
      }
    };

    detectDevTools(); // Kiểm tra khi trang load
    
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


export default App;
