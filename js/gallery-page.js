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

  prewedding: [
   "gallery/prewedding/1.jpg",
    "gallery/prewedding/2.jpg",
    "gallery/prewedding/3.jpg",
    "gallery/prewedding/4.jpg",
    "gallery/prewedding/5.jpg",
    "gallery/prewedding/1.mp4",
    "gallery/prewedding/6.jpg",
    "gallery/prewedding/7.jpg",
    "gallery/prewedding/8.jpg",
    "gallery/prewedding/9.jpg",
    "gallery/prewedding/10.jpg",
    "gallery/prewedding/11.jpg",
    "gallery/prewedding/2.mp4",
    "gallery/prewedding/12.jpg",
    "gallery/prewedding/13.jpg",
    "gallery/prewedding/3.mp4",
    "gallery/prewedding/14.jpg",
    "gallery/prewedding/15.jpg"
  ],

  birthday: [
    "gallery/birthday/1.jpg",
    "gallery/birthday/2.jpg",
    "gallery/birthday/3.jpg",
    "gallery/birthday/4.jpg",
    "gallery/birthday/5.jpg",
    "gallery/birthday/1.mp4",
    "gallery/birthday/6.jpg",
    "gallery/birthday/7.jpg",
    "gallery/birthday/8.jpg",
    "gallery/birthday/9.jpg",
    "gallery/birthday/10.jpg",
    "gallery/birthday/11.jpg",
    "gallery/birthday/2.mp4",
    "gallery/birthday/12.jpg",
    "gallery/birthday/13.jpg",
    "gallery/birthday/3.mp4",
    "gallery/birthday/14.jpg",
    "gallery/birthday/15.jpg"

  ],

  corporate: [
    "gallery/corporate/1.jpg",
    "gallery/corporate/2.jpg",
    "gallery/corporate/3.jpg",
    "gallery/corporate/4.jpg",
    "gallery/corporate/5.jpg",
    "gallery/corporate/1.mp4",
    "gallery/corporate/6.jpg",
    "gallery/corporate/7.jpg",
    "gallery/corporate/8.jpg",
    "gallery/corporate/9.jpg",
    "gallery/corporate/10.jpg",
    "gallery/corporate/11.jpg",
    "gallery/corporate/2.mp4",
    "gallery/corporate/12.jpg",
    "gallery/corporate/13.jpg",
    "gallery/corporate/3.mp4",
    "gallery/corporate/14.jpg",
    "gallery/corporate/15.jpg"
  ],

  drone: [
     "gallery/drone/1.jpg",
    "gallery/drone/2.jpg",
    "gallery/drone/3.jpg",
    "gallery/drone/4.jpg",
    "gallery/drone/5.jpg",
    "gallery/drone/1.mp4",
    "gallery/drone/6.jpg",
    "gallery/drone/7.jpg",
    "gallery/drone/8.jpg",
    "gallery/drone/9.jpg",
    "gallery/drone/10.jpg",
    "gallery/drone/11.jpg",
    "gallery/drone/2.mp4",
    "gallery/drone/12.jpg",
    "gallery/drone/13.jpg",
    "gallery/drone/3.mp4",
    "gallery/drone/14.jpg",
    "gallery/drone/15.jpg"
  ]
};

// ===========================
// CATEGORY NAMES
// ===========================
const categoryNames = {
  wedding: "Wedding",
  prewedding: "Pre-Wedding",
  birthday: "Birthday",
  corporate: "Corporate",
  drone: "Drone Shoot"
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

