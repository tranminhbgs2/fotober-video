import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { VideoPlayer } from './VideoPlayer'; // Import component VideoPlayer
import './App.css';

const isCheckRequest = () => {
  return new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
            resolve(); // Giải quyết Promise khi đăng ký thành công
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
            reject(error); // Từ chối Promise nếu có lỗi
          });
      });
    } else {
      resolve(); // Giải quyết Promise ngay lập tức nếu không hỗ trợ Service Worker
    }
  });
};

// Hàm kiểm tra trình duyệt
const isSupportedBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const userAgentData = navigator.userAgentData ? navigator.userAgentData : null; // Kiểm tra xem userAgentData có tồn tại

console.log(navigator);

// Danh sách các trình duyệt hỗ trợ
const supportedBrowsers = ['chrome', 'firefox', 'safari', 'brave', 'edg'];

if (userAgentData && userAgentData.brands) {
    // Kiểm tra trình duyệt dựa trên userAgentData
    const brands = userAgentData.brands.map(({ brand }) => brand.toLowerCase());
    console.log(brands);

    if (brands.length > 0) {
        return brands.some(brand => 
            brand === 'google chrome' || 
            brand === 'firefox' || 
            brand === 'microsoft edge' || 
            brand === 'brave' || 
            brand === 'safari'
        );
    }
}

// Nếu userAgentData không tồn tại, kiểm tra userAgent
if (userAgent) {
    // Kiểm tra dựa trên danh sách supportedBrowsers
    return supportedBrowsers.some(browser => userAgent.includes(browser));
}

// Mặc định trả về false nếu không tìm thấy trình duyệt hỗ trợ
return false;
};

export function App(props) {
  const bands = navigator.userAgentData.brands.map(({ brand }) => brand);
  const userAgent = navigator.userAgent.toLowerCase();
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false); // Trạng thái phản hồi 403
// Function to detect if DevTools is open

  useEffect(() => {
    
    setIsBrowserSupported(isSupportedBrowser()); // Kiểm tra trình duyệt
    const initialize = async () => {
      try {
        await isCheckRequest(); // Chờ cho isCheckRequest hoàn thành

        // Lắng nghe thông điệp từ Service Worker
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'FORBIDDEN') {
              setIsForbidden(true); // Gán trạng thái là forbidden
            }
          });
        }

        // Ngăn phím F12 và Ctrl+U (Xem mã nguồn)
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);
      } catch (error) {
        console.error('Có lỗi xảy ra trong quá trình kiểm tra yêu cầu:', error);
      }
    };

    initialize(); // Gọi hàm initialize

    // Cleanup các event listeners khi component bị unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  // Kiểm tra phản hồi 403
  if (isForbidden) {
    return <h1>You do not have permission to access this content. Please use another browser</h1>;
  } else if (!isBrowserSupported) {
    return <h1>Your browser is not supported to view this video. {bands.join(', ')} || {userAgent}</h1>;
  }

  return (
    
    <Routes>
      <Route path="/video/:order_id/:video_id" element={<VideoPlayer  />} />
      {/* Có thể thêm các route khác ở đây nếu cần */}
    </Routes>
  );
}


export default App;
