const a=["DO YOU WANT TO COME?","ARE YOU READY TO JOIN?","SHALL WE BEGIN NOW?","WANT TO EXPERIENCE MORE?","DARE TO TAKE THE LEAP?"],e=document.querySelector(".animated-text");let n=0;function o(l){if(!e)return;e.innerHTML="",[...l].forEach((r,i)=>{const t=document.createElement("span");t.textContent=r,t.style.opacity="0",t.style.transform="translateY(20px)",t.style.display="inline-block",t.style.transition="all 0.3s ease-in-out",r===" "&&(t.style.width="0.5em"),e.appendChild(t),setTimeout(()=>{t.style.opacity="1",t.style.transform="translateY(0)"},40*i)})}function c(){if(!e)return;e.querySelectorAll("span").forEach(s=>{s.style.transition="all 0.3s ease",s.style.opacity="0",s.style.transform="translateY(-10px)"}),setTimeout(()=>{n=(n+1)%a.length,o(a[n])},600)}o(a[0]);setInterval(c,5e3);
