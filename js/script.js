//Variables
const imageContainer = document.querySelector("#image-container");
const loader = document.querySelector("#loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

let isInitialLoad = true;
//Unsplash API
let initialCount = 5;
const apiKey = "5Y9PLPGeSEHYCjVfI4kDOIOT59vTwo72IE8RjN3lli8";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

//update after initial load
function updateUrlWithNewCount(imgCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imgCount}`;
}

//fn check if all imgs are loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

//fn set attributes to elements (for in loop)
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

//Create elements for links and photos, add them to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  photosArray.forEach((photo) => {
    //create <a> to link to Unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "blank",
    });
    //create <img> for photo
    const img = document.createElement("img");

    if (photo.location.country === null) {
      photo.location.country = "Who knows?";
    }
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_decription,
      title:
        "Camera model: " +
        photo.exif.model +
        ", Location: " +
        photo.location.country,
    });
    //put <img> inside <a>, then both to image container
    item.appendChild(img);
    imageContainer.appendChild(item);
    //when image is finished loading, run fn
    img.addEventListener("load", imageLoaded);
  });
}

//Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    console.log(photosArray);
    displayPhotos();
    if (isInitialLoad) {
      updateUrlWithNewCount(30);
      isInitialLoad = false;
    }
  } catch {
    console.log("Oh, shit!");
  }
}

//If scrolled near bottom && all previous images are loaded => load more photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    getPhotos();
    ready = false;
  }
});

//On load
getPhotos();
