"use strict";

// urls.js
var urls = {
  link_profileBento: "https://x.com/",
  link_X: "https://x.com/",
  link_Instagram: "https://x.com/",
  link_Figma: "https://x.com/"
}; // main.js

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a[data-url-key]").forEach(function (anchor) {
    var urlKey = anchor.getAttribute("data-url-key");

    if (urls[urlKey]) {
      anchor.setAttribute("href", urls[urlKey]);
    }
  });
});