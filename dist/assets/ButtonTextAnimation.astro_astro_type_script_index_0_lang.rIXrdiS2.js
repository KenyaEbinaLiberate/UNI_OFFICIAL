document.addEventListener("DOMContentLoaded",()=>{const i=()=>{const e=document.querySelectorAll(".floating__navi .menu__wrap .button p, .floating__navi .menu__wrap .text__link p");requestAnimationFrame(()=>{e.forEach(t=>{if(!t.querySelector("span")){const n=t.textContent?.trim()||"",a=document.createDocumentFragment();[...n].forEach((s,p)=>{const r=document.createElement("span");r.textContent=s===" "?" ":s,r.style.cssText=`
              display: inline-block;
              transition: all 0.3s ease-in-out;
              width: ${s===" "?"0.5em":"auto"};
            `,a.appendChild(r)}),t.textContent="",t.appendChild(a)}})})},c=e=>{e.querySelectorAll("span").forEach((n,a)=>{n.style.opacity="0",n.style.transform="translateY(20px)",setTimeout(()=>{n.style.opacity="1",n.style.transform="translateY(0)"},40*a)})},l=e=>{e.querySelectorAll("span").forEach(n=>{n.style.opacity="",n.style.transform=""})},u=new MutationObserver(e=>{e.forEach(t=>{t.target.classList.contains("is__open")&&i()})});document.querySelectorAll(".floating__navi .menu__wrap .button, .floating__navi .menu__wrap .text__link").forEach(e=>{e.addEventListener("mouseenter",()=>{const t=e.querySelector("p");t&&c(t)}),e.addEventListener("mouseleave",()=>{const t=e.querySelector("p");t&&l(t)})});const o=document.querySelector(".floating__navi");o&&(u.observe(o,{attributes:!0,attributeFilter:["class"]}),o.classList.contains("is__open")&&i())});
