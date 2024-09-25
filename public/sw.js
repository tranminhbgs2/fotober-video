self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request);


  // Bạn có thể tùy chỉnh phản hồi nếu muốn:
  event.respondWith(
    fetch(event.request).then(response => {

      //check coccoc
      if (event.request.url.includes('logo_cc.svg')) {
        return throwError();
      }
      return response;
    }).catch(error => {
      console.error('Fetch failed:', error);
      return new Response('Failed to fetch data');
    })
  );
});