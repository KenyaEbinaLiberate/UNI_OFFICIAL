"use strict";

var PageWrap;
var PageInner;
var lenis;
/*--
function resizeReloadFunc() {
  var timer = 0;
  var currentWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    if (currentWidth == window.innerWidth) {
      return;
    }
    if (timer > 0) {
      clearTimeout(timer);
    }

    timer = setTimeout(function () {
      location.reload();
    }, 100);
  });
}
--*/
//ロード時に実行

function loadingFunc() {
  if (lenis) {
    lenis.stop();
    var pageInner = document.querySelector(".pageInner");
    var humBtn = document.querySelector(".humBtn");
    setTimeout(function () {
      if (pageInner) pageInner.classList.add("active");
      if (humBtn) humBtn.classList.add("loaded");
      lenis.start();
    }, 100);
  }
} //lenisの実行


function lenisScrollFunc() {
  PageWrap = document.querySelector(".pageWrap");
  PageInner = document.querySelector(".pageInner"); // 必要な要素が存在しない場合は通常のスクロールを使用

  if (!PageWrap || !PageInner) {
    console.warn("Lenis: 必要な要素が見つかりません。通常のスクロールを使用します。");
    return;
  } // lenisが既に存在する場合は破棄する


  if (lenis) {
    lenis.destroy();
  }

  lenis = new Lenis({
    wrapper: PageWrap,
    content: PageInner,
    syncTouch: true,
    lerp: 0.07,
    wheelMultiplier: 0.8,
    touchMultiplier: 1,
    touchInertiaMultiplier: 15,
    smoothWheel: true
  }); // グローバル変数として保存

  window.lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  var currentScrollPosition;
  lenis.on("scroll", function (_ref) {
    var scroll = _ref.scroll;
    currentScrollPosition = scroll;
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  var dataElements = document.querySelectorAll("[data-scroll]");
  dataElements.forEach(function (element) {
    element.addEventListener("click", function (e) {
      e.preventDefault();
      var secId = "#" + element.dataset.scroll;
      lenis.scrollTo(secId, {
        offset: 0
      });
    });
  });
} //ハンバーガーメニュー


function humBtnFunc() {
  var humBtn = document.querySelector(".humBtn");
  var humBtnBase = document.querySelector(".humBtnBase");
  var humWrap = document.querySelector(".humWrap");
  humBtn.addEventListener("click", function () {
    humBtn.classList.toggle("active");
    humBtnBase.classList.toggle("active");
    humWrap.classList.toggle("active");
  });
  var links = document.querySelectorAll(".hum__inner-main-right-sitemap .hum__inner-main-right-sitemap-link");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      humBtn.classList.remove("active");
      humBtnBase.classList.remove("active");
      humWrap.classList.remove("active");
    });
  });
}

function loadHeader() {
  fetch("/inc/header.html").then(function (response) {
    if (!response.ok) {
      throw new Error("HTTP error! status: ".concat(response.status));
    }

    return response.text();
  }).then(function (data) {
    document.getElementById("header").innerHTML = data; // ヘッダー読み込み完了後にhumBtnFuncを実行

    humBtnFunc();
  })["catch"](function (error) {
    console.error("ヘッダーの読み込みエラー:", error);
  });
}

function loadFooter() {
  fetch("/inc/footer.html").then(function (response) {
    if (!response.ok) {
      throw new Error("HTTP error! status: ".concat(response.status));
    }

    return response.text();
  }).then(function (data) {
    document.getElementById("footer").innerHTML = data;
    var h1Element = document.querySelector("h1");
    var h1Box = document.querySelector(".h1__box");

    if (h1Element && h1Box) {
      h1Box.appendChild(h1Element);
    } // フッター読み込み完了後にアニメーションを設定


    gsap.from("footer", {
      scrollTrigger: {
        trigger: ".footer__trigger",
        start: "bottom 100%",
        end: "bottom 0%",
        scrub: true,
        scroller: PageWrap
      },
      y: "-50%"
    });
  })["catch"](function (error) {
    console.error("フッターの読み込みエラー:", error);
  });
}

function customCursorFunc() {
  var cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor); // カーソルの初期位置を設定

  var cursorX = 0;
  var cursorY = 0;
  var currentX = 0;
  var currentY = 0; // カーソルの位置を更新

  document.addEventListener("mousemove", function (e) {
    cursorX = e.clientX + 8; // 右に8pxずらす

    cursorY = e.clientY + 8; // 下に8pxずらす
  }); // GSAPアニメーション

  gsap.ticker.add(function () {
    // イージングを適用
    var ease = 0.15;
    currentX += (cursorX - currentX) * ease;
    currentY += (cursorY - currentY) * ease; // カーソル位置を更新

    cursor.style.left = currentX + "px";
    cursor.style.top = currentY + "px";
  }); // ホバーイベントを設定する関数

  function setupHoverEvents() {
    var links = document.querySelectorAll("a, .cursor-target");
    links.forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        cursor.classList.add("cursor-hover");
      });
      link.addEventListener("mouseleave", function () {
        cursor.classList.remove("cursor-hover");
      });
    });
  } // 初期設定


  setupHoverEvents(); // headerとfooterの読み込み完了後にイベントを再設定

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        setupHoverEvents();
      }
    });
  }); // header と footer の監視を開始

  var headerEl = document.getElementById("header");
  var footerEl = document.getElementById("footer");
  if (headerEl) observer.observe(headerEl, {
    childList: true
  });
  if (footerEl) observer.observe(footerEl, {
    childList: true
  });
}

function spanSplitFunc() {
  gsap.registerPlugin(ScrollTrigger);
  var spanElements = document.querySelectorAll(".js-span");
  spanElements.forEach(function (spanElement) {
    var html = spanElement.innerHTML;
    var wrappedHtml = html.replace(/(<br[^>]*>)|([^<>]+)/g, function (match, br, text) {
      if (br) {
        return br;
      } else {
        return text.split("").map(function (_char) {
          return "<span>".concat(_char, "</span>");
        }).join("");
      }
    });
    spanElement.innerHTML = wrappedHtml;
  });
  var jsSpansCopy = document.querySelectorAll(".span__anm");
  jsSpansCopy.forEach(function (jsSpansCopySpan, index) {
    var spanElements = jsSpansCopySpan.querySelectorAll("span");
    var copyOpacityAnim = gsap.timeline({
      scrollTrigger: {
        trigger: jsSpansCopySpan,
        start: "top 80%",
        end: "bottom 80%",
        scrub: true,
        ease: "ease",
        scroller: PageWrap
      }
    });
    spanElements.forEach(function (span) {
      copyOpacityAnim.fromTo(span, {
        opacity: "0.1"
      }, {
        opacity: "1"
      });
    });
  });
}

function scrollTriggerCommonAnimFunc() {
  gsap.registerPlugin(ScrollTrigger);
  var maskElements = document.querySelectorAll(".mask__anm");
  maskElements.forEach(function (element) {
    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      end: "bottom -99999%",
      scroller: PageWrap,
      toggleClass: {
        targets: element,
        className: "anm__01"
      },
      once: true
    });
  }); // フローティングナビゲーションの表示/非表示制御

  ScrollTrigger.create({
    trigger: ".section__FV",
    start: "bottom top",
    endTrigger: "footer",
    end: "center 30%",
    scroller: PageWrap,
    toggleClass: {
      targets: ".floating__navi",
      className: "is_active"
    },
    onLeave: function onLeave() {
      var floatingNavi = document.querySelector(".floating__navi");

      if (floatingNavi) {
        floatingNavi.classList.remove("is_active");
        floatingNavi.classList.add("is_off");
      }
    },
    onEnterBack: function onEnterBack() {
      var floatingNavi = document.querySelector(".floating__navi");

      if (floatingNavi) {
        floatingNavi.classList.add("is_active");
        floatingNavi.classList.remove("is_off");
      }
    }
  });
}

function loadingAnmFunc() {
  // AnimationQueueを使わずにsetTimeoutで順番に実行
  // 1. .load__anm に loaded クラスを追加
  setTimeout(function () {
    var loadAnm = document.querySelector(".load__anm");
    if (loadAnm) loadAnm.classList.add("loaded");
  }, 200);
}

window.addEventListener("DOMContentLoaded", function () {
  //resizeReloadFunc();
  lenisScrollFunc(); // lenisを先に初期化

  loadingAnmFunc();
  loadHeader();
  loadFooter();
  loadingFunc();
  spanSplitFunc();
  stAnimFunc();
  customCursorFunc();
  scrollTriggerCommonAnimFunc();
});