import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
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
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleDevToolsDetection);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      // window.addEventListener('resize', handleDevToolsDetection);
    };
  }, []);

  if (!isSupportedBrowser()) {
    return <div>Trình duyệt của bạn không được hỗ trợ để xem video này.</div>;
  }
  return (
    <div className="video-wrapper">
      <ReactPlayer
        url="https://www.dropbox.com/scl/fi/bb7gj60p96dejr12mz5i7/Short-Vertical.mp4?rlkey=wh3azk0e34rqrqr3h1hm12v9o&st=jqgsmo92&raw=1"
        width="100%"
        height="100%"
        controls={true} // Hiển thị điều khiển phát lại
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload', // Không cho phép tải xuống qua menu controls
              onContextMenu: e => e.preventDefault() // Vô hiệu hóa menu chuột phải
            }
          }
        }}
      />
    </div>
  );
}

// Log to console
console.log('Hello console');
