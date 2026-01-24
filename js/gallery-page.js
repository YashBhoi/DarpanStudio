// ===========================
// GALLERY DATA
// ===========================
const data = {
  wedding: [
    "gallery/wedding/1.jpg",
    "gallery/wedding/2.jpg",
    "gallery/wedding/3.jpg",
    "gallery/wedding/4.jpg",
    "gallery/wedding/5.jpg",
    "gallery/wedding/1.mp4",
    "gallery/wedding/6.jpg",
    "gallery/wedding/7.jpg",
    "gallery/wedding/8.jpg",
    "gallery/wedding/9.jpg",
    "gallery/wedding/10.jpg",
    "gallery/wedding/11.jpg",
    "gallery/wedding/2.mp4",
    "gallery/wedding/12.jpg",
    "gallery/wedding/13.jpg",
    "gallery/wedding/3.mp4",
    "gallery/wedding/14.jpg",
    "gallery/wedding/15.jpg"
  ],
  birthday: [
    "gallery/birthday/1.jpg",
    "gallery/birthday/2.mp4",
    "gallery/birthday/3.jpg"
  ],
  corporate: [
    "gallery/corporate/1.mp4",
    "gallery/corporate/2.jpg",
    "gallery/corporate/3.mp4"
  ]
};

// ===========================
// CATEGORY NAMES
// ===========================
const categoryNames = {
  wedding: "Wedding",
  birthday: "Birthday",
  corporate: "Corporate"
};

// ===========================
// ELEMENTS
// ===========================
const params = new URLSearchParams(window.location.search);
const cat = params.get("cat") || "wedding";

const galleryEl = document.getElementById("gallery");
const titleEl = document.getElementById("galleryTitle");
const menuEl = document.getElementById("categoryMenu");

const filterRadios = document.querySelectorAll('input[name="filter"]');
const filterLabels = document.querySelectorAll(".filter");

// ===========================
// RENDER CATEGORY MENU
// ===========================
menuEl.innerHTML = Object.keys(data)
  .map(c => `
    <a href="?cat=${c}" class="${c === cat ? 'active' : ''}">
      ${categoryNames[c]}
    </a>
  `)
  .join("");

// ===========================
// SET GALLERY TITLE
// ===========================
titleEl.innerText = categoryNames[cat] + " Gallery";

// ===========================
// FUNCTION TO RENDER GALLERY
// ===========================
function renderGallery(filter = "all") {
  galleryEl.innerHTML = "";

  data[cat].forEach(file => {
    const isVideo = /\.(mp4|webm|ogg)$/i.test(file);

    if (filter === "photos" && isVideo) return;
    if (filter === "videos" && !isVideo) return;

    galleryEl.insertAdjacentHTML(
      "beforeend",
      `
      <a href="${file}" class="glightbox" data-gallery="${cat}">
        ${
          isVideo
            ? `<video src="${file}" muted autoplay loop playsinline preload="metadata"></video>`
            : `<img src="${file}" loading="lazy" alt="">`
        }
      </a>
      `
    );
  });

  // FORCE AUTOPLAY VIDEOS IN GRID
  document.querySelectorAll(".gallery video").forEach(video => {
    video.muted = true;
    video.play().catch(() => {});
  });

  // RE-INIT GLIGHTBOX
  const lightbox = GLightbox({
    selector: ".glightbox",
    loop: true,
    touchNavigation: true,
    autoplayVideos: true,
    videosWidth: "100vw",
    plyr: {
      css: "https://cdn.plyr.io/3.7.8/plyr.css",
      js: "https://cdn.plyr.io/3.7.8/plyr.js",
      config: {
        autoplay: true,
        muted: true,
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "fullscreen"
        ]
      }
    }
  });

  // AUTOPLAY VIDEOS IN LIGHTBOX
  lightbox.on("slide_changed", ({ current }) => {
    const video = current.slideNode.querySelector("video");
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  });
}

// ===========================
// INITIAL STATE
// ===========================
renderGallery("all");

// ensure ALL is highlighted on load
filterLabels.forEach(label => label.classList.remove("active"));
document.querySelector('.filter input[value="all"]').closest(".filter").classList.add("active");

// ===========================
// FILTER BUTTON EVENTS
// ===========================
filterRadios.forEach(radio => {
  radio.addEventListener("change", () => {

    // update active UI
    filterLabels.forEach(label => label.classList.remove("active"));
    radio.closest(".filter").classList.add("active");

    // render gallery
    renderGallery(radio.value);
  });
});
