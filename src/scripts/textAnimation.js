document.addEventListener("DOMContentLoaded", () => {
  const wrapCharactersInSpan = () => {
    document
      .querySelectorAll(".floating__navi .menu__wrap .button p")
      .forEach((element) => {
        if (!element.querySelector("span")) {
          // 既にspan要素がない場合のみ実行
          const text = element.textContent.trim();
          element.textContent = "";
          [...text].forEach((char) => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char; // スペースの場合は&nbsp;を使用
            element.appendChild(span);
          });
        }
      });
  };

  // メニューが開かれたときにテキストを処理
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains("is__open")) {
        wrapCharactersInSpan();
      }
    });
  });

  const floatingNavi = document.querySelector(".floating__navi");
  if (floatingNavi) {
    observer.observe(floatingNavi, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
});
