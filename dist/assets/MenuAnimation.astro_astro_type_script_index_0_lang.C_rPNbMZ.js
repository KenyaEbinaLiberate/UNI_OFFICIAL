const s=document.querySelector(".floating__navi"),i=document.querySelector(".navi__arrow"),t=document.querySelector(".message__area"),l=document.querySelector(".plus__icon"),c=document.querySelector(".plus__icon > div"),o=document.querySelector(".menu__wrap"),r=document.querySelector(".menu__overlay");let e=!1,a=0;const f=()=>{a=window.scrollY,document.body.style.position="fixed",document.body.style.top=`-${a}px`,document.body.style.width="100%",document.documentElement.style.overflow="hidden",document.body.style.touchAction="none"},v=()=>{document.body.style.position="",document.body.style.top="",document.body.style.width="",document.documentElement.style.overflow="",window.scrollTo(0,a)},y=()=>{const d=document.getElementById("time");d&&window.requestAnimationFrame(()=>{const n=new Date,u=String(n.getHours()).padStart(2,"0"),m=String(n.getMinutes()).padStart(2,"0"),p=String(n.getSeconds()).padStart(2,"0");d.textContent=`${u}:${m}:${p}`})};setInterval(y,1e3);y();s&&s.addEventListener("click",()=>{e=!e,r&&(r.style.opacity=e?"1":"0",r.style.visibility=e?"visible":"hidden",e?f():v()),s.classList.toggle("is__open"),i&&(i.style.transform=e?"rotate(180deg)":"rotate(0)",i.style.transition="transform 0.3s ease"),t&&(t.style.opacity=e?"0":"1",t.style.display=e?"none":"block",t.style.transition="opacity 0.3s ease"),l&&c&&(l.style.transform=e?"rotate(180deg)":"rotate(0)",l.style.transition="transform 0.3s ease",c.style.opacity=e?"0":"1",c.style.transition="opacity 0.3s ease"),o&&(o.style.opacity=e?"1":"0",o.style.visibility=e?"visible":"hidden",o.style.transition="opacity 0.3s ease, visibility 0.3s ease")});
