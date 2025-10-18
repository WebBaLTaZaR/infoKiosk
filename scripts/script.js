const videos = [
	'assets/videos/1.mp4',
	'assets/videos/2.mp4',
	'assets/videos/3.mp4',
  'assets/videos/4.mp4'
  ];
  
  let currentIndex = 0;
  const video = document.getElementById('promo-video');
  
  video.src = videos[currentIndex];
  video.load();
  video.play();
  
  video.addEventListener('ended', () => {
	currentIndex = (currentIndex + 1) % videos.length;
	video.src = videos[currentIndex];
  video.load();
	video.play();
  });
  