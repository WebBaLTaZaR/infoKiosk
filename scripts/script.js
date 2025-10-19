const videos = [
  "assets/videos/1.mp4",
  "assets/videos/2.mp4",
  "assets/videos/3.mp4",
  "assets/videos/4.mp4",
];

let currentIndex = 0;
const video = document.getElementById("promo-video");

video.src = videos[currentIndex];
video.load();
video.play();

video.addEventListener("ended", () => {
  currentIndex = (currentIndex + 1) % videos.length;
  video.src = videos[currentIndex];
  video.load();
  video.play();
});

function adjustServiceLayout() {
  const container = document.querySelector(".listServices");
  const items = container.querySelectorAll(".otherServiceItem");
  const count = items.length;

  container.classList.add("many-items");

  if (count <= 4) {
    container.style.gridTemplateColumns = "1fr";
    container.style.gridTemplateRows = `repeat(${count}, 1fr)`;
  } else if (count <= 8) {
    container.style.gridTemplateColumns = "repeat(2, 1fr)";
    container.style.gridTemplateRows = "repeat(4, 1fr)";
  } else if (count <= 12) {
    container.style.gridTemplateColumns = "repeat(3, 1fr)";
    container.style.gridTemplateRows = "repeat(4, 1fr)";
  } else {
    container.style.gridTemplateColumns = "repeat(4, 1fr)";
    container.style.gridTemplateRows = "repeat(4, 1fr)";
  }
}
document.addEventListener("DOMContentLoaded", adjustServiceLayout);



