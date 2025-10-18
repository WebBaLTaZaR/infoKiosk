const videos = [
	'assets/videos/clip1.mp4',
	'assets/videos/clip2.mp4',
	'assets/videos/clip3.mp4'
  ];
  
  let currentIndex = 0;
  const video = document.getElementById('promo-video');
  
  video.src = videos[currentIndex];
  video.play();
  
  video.addEventListener('ended', () => {
	currentIndex = (currentIndex + 1) % videos.length;
	video.src = videos[currentIndex];
	video.play();
  });
  