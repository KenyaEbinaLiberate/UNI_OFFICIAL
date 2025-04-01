"use strict";

function scrollTriggerAnimFunc() {
  // grid__bgにclass__01を追加
  ScrollTrigger.create({
    trigger: ".section__intro",
    start: "top 100%",
    end: "bottom -99999%",
    scroller: PageWrap,
    toggleClass: {
      targets: ".grid__bg",
      className: "anm__01"
    }
  });
}

window.addEventListener("DOMContentLoaded", function () {
  scrollTriggerAnimFunc();
});