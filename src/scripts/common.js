let PageWrap;
let PageInner;
let lenis;
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
    const pageInner = document.querySelector('.pageInner');
    const humBtn = document.querySelector('.humBtn');

    setTimeout(() => {
      if (pageInner) pageInner.classList.add('active');
      if (humBtn) humBtn.classList.add('loaded');
      lenis.start();
    }, 100);
  }
}

//lenisの実行
function lenisScrollFunc() {
  PageWrap = document.querySelector('.pageWrap');
  PageInner = document.querySelector('.pageInner');

  // 必要な要素が存在しない場合は通常のスクロールを使用
  if (!PageWrap || !PageInner) {
    console.warn('Lenis: 必要な要素が見つかりません。通常のスクロールを使用します。');
    return;
  }

  // lenisが既に存在する場合は破棄する
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
    smoothWheel: true,
  });

  // グローバル変数として保存
  window.lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  let currentScrollPosition;
  lenis.on('scroll', ({ scroll }) => {
    currentScrollPosition = scroll;
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  const dataElements = document.querySelectorAll('[data-scroll]');

  dataElements.forEach(element => {
    element.addEventListener('click', e => {
      e.preventDefault();
      const secId = '#' + element.dataset.scroll;
      lenis.scrollTo(secId, { offset: 0 });
    });
  });
}

//ハンバーガーメニュー
function humBtnFunc() {
  const humBtn = document.querySelector('.humBtn');
  const humBtnBase = document.querySelector('.humBtnBase');
  const humWrap = document.querySelector('.humWrap');

  humBtn.addEventListener('click', () => {
    humBtn.classList.toggle('active');
    humBtnBase.classList.toggle('active');
    humWrap.classList.toggle('active');
  });

  const links = document.querySelectorAll(
    '.hum__inner-main-right-sitemap .hum__inner-main-right-sitemap-link'
  );

  links.forEach(link => {
    link.addEventListener('click', () => {
      humBtn.classList.remove('active');
      humBtnBase.classList.remove('active');
      humWrap.classList.remove('active');
    });
  });
}

function loadHeader() {
  fetch('/inc/header.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('header').innerHTML = data;

      // ヘッダー読み込み完了後にhumBtnFuncを実行
      humBtnFunc();
    })
    .catch(error => {
      console.error('ヘッダーの読み込みエラー:', error);
    });
}

function loadFooter() {
  fetch('/inc/footer.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('footer').innerHTML = data;
      const h1Element = document.querySelector('h1');
      const h1Box = document.querySelector('.h1__box');
      if (h1Element && h1Box) {
        h1Box.appendChild(h1Element);
      }

      // フッター読み込み完了後にアニメーションを設定
      gsap.from('footer', {
        scrollTrigger: {
          trigger: '.footer__trigger',
          start: 'bottom 100%',
          end: 'bottom 0%',
          scrub: true,
          scroller: PageWrap,
        },
        y: '-50%',
      });
    })
    .catch(error => {
      console.error('フッターの読み込みエラー:', error);
    });
}

function customCursorFunc() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  // カーソルの初期位置を設定
  let cursorX = 0;
  let cursorY = 0;
  let currentX = 0;
  let currentY = 0;

  // カーソルの位置を更新
  document.addEventListener('mousemove', e => {
    cursorX = e.clientX + 8; // 右に8pxずらす
    cursorY = e.clientY + 8; // 下に8pxずらす
  });

  // GSAPアニメーション
  gsap.ticker.add(() => {
    // イージングを適用
    const ease = 0.15;
    currentX += (cursorX - currentX) * ease;
    currentY += (cursorY - currentY) * ease;

    // カーソル位置を更新
    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';
  });

  // ホバーイベントを設定する関数
  function setupHoverEvents() {
    const links = document.querySelectorAll('a, .cursor-target');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
      });
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
      });
    });
  }

  // 初期設定
  setupHoverEvents();

  // headerとfooterの読み込み完了後にイベントを再設定
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        setupHoverEvents();
      }
    });
  });

  // header と footer の監視を開始
  const headerEl = document.getElementById('header');
  const footerEl = document.getElementById('footer');
  if (headerEl) observer.observe(headerEl, { childList: true });
  if (footerEl) observer.observe(footerEl, { childList: true });
}

function spanSplitFunc() {
  gsap.registerPlugin(ScrollTrigger);

  const spanElements = document.querySelectorAll('.js-span');

  spanElements.forEach(spanElement => {
    const html = spanElement.innerHTML;
    const wrappedHtml = html.replace(/(<br[^>]*>)|([^<>]+)/g, (match, br, text) => {
      if (br) {
        return br;
      } else {
        return text
          .split('')
          .map(char => `<span>${char}</span>`)
          .join('');
      }
    });
    spanElement.innerHTML = wrappedHtml;
  });

  const jsSpansCopy = document.querySelectorAll('.span__anm');

  jsSpansCopy.forEach((jsSpansCopySpan, index) => {
    const spanElements = jsSpansCopySpan.querySelectorAll('span');
    const copyOpacityAnim = gsap.timeline({
      scrollTrigger: {
        trigger: jsSpansCopySpan,
        start: 'top 80%',
        end: 'bottom 80%',
        scrub: true,
        ease: 'ease',
        scroller: PageWrap,
      },
    });

    spanElements.forEach(span => {
      copyOpacityAnim.fromTo(
        span,
        {
          opacity: '0.1',
        },
        {
          opacity: '1',
        }
      );
    });
  });
}

function scrollTriggerCommonAnimFunc() {
  gsap.registerPlugin(ScrollTrigger);
  const maskElements = document.querySelectorAll('.mask__anm');
  maskElements.forEach(element => {
    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      end: 'bottom -99999%',
      scroller: PageWrap,
      toggleClass: {
        targets: element,
        className: 'anm__01',
      },
      once: true,
    });
  });

  // フローティングナビゲーションの表示/非表示制御
  ScrollTrigger.create({
    trigger: '.section__FV',
    start: 'bottom top',
    endTrigger: 'footer',
    end: 'center 30%',
    scroller: PageWrap,
    toggleClass: {
      targets: '.floating__navi',
      className: 'is_active',
    },
    onLeave: () => {
      const floatingNavi = document.querySelector('.floating__navi');
      if (floatingNavi) {
        floatingNavi.classList.remove('is_active');
        floatingNavi.classList.add('is_off');
      }
    },
    onEnterBack: () => {
      const floatingNavi = document.querySelector('.floating__navi');
      if (floatingNavi) {
        floatingNavi.classList.add('is_active');
        floatingNavi.classList.remove('is_off');
      }
    },
  });
}

function loadingAnmFunc() {
  // AnimationQueueを使わずにsetTimeoutで順番に実行

  // 1. .load__anm に loaded クラスを追加
  setTimeout(() => {
    const loadAnm = document.querySelector('.load__anm');
    if (loadAnm) loadAnm.classList.add('loaded');
  }, 200);
}

window.addEventListener('DOMContentLoaded', function () {
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
