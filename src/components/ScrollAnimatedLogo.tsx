import { useEffect, useRef, useState } from 'react';
import styles from './ScrollAnimatedLogo.module.css';

export const ScrollAnimatedLogo = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = Math.min((currentScroll / scrollHeight) * 100, 100);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.container}>
      <svg
        ref={svgRef}
        width="400"
        height="400"
        viewBox="0 0 65 65"
        className={`${styles.logo} ${isVisible ? styles.visible : ''}`}
        style={
          {
            '--scroll-progress': `${scrollProgress}%`,
          } as React.CSSProperties
        }
      >
        <path
          className={styles.path}
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M55 9.99999L46.6895 19.4977L56.8754 12.0466L47.7687 20.7839L58.5653 14.2489L48.7318 22.1592L60.0568 16.5901L49.5712 23.6133L61.3385 19.0524L50.2808 25.1349L62.4008 21.617L50.855 26.7127L63.2356 24.2644L51.2896 28.3344L63.8364 26.9745L51.5811 29.9879L64.1987 29.7267L51.7275 31.6605L64.3198 32.5L51.7274 33.3395L64.1987 35.2733L51.5811 35.0121L63.8364 38.0254L51.2896 36.6655L63.2356 40.7355L50.855 38.2873L62.4008 43.383L50.2808 39.865L61.3385 45.9476L49.5712 41.3867L60.0567 48.4099L48.7317 42.8407L58.5652 50.7511L47.7687 44.2161L56.8754 52.9534L46.6895 45.5023L55 55L45.5022 46.6894L52.9534 56.8754L44.2161 47.7687L50.7511 58.5652L42.8408 48.7317L48.4099 60.0567L41.3867 49.5711L45.9476 61.3385L39.8651 50.2808L43.383 62.4008L38.2873 50.855L40.7356 63.2356L36.6655 51.2895L38.0254 63.8364L35.0121 51.5811L35.2733 64.1987L33.3395 51.7275L32.5 64.3198L31.6605 51.7274L29.7267 64.1987L29.9879 51.5812L26.9746 63.8364L28.3345 51.2896L24.2644 63.2355L26.7127 50.855L21.617 62.4008L25.1349 50.2808L19.0524 61.3385L23.6133 49.5712L16.5901 60.0567L22.1593 48.7317L14.2489 58.5652L20.7839 47.7687L12.0466 56.8754L19.4977 46.6895L10 55L18.3105 45.5022L8.12462 52.9534L17.2313 44.2161L6.43476 50.7511L16.2683 42.8407L4.94325 48.4099L15.4288 41.3867L3.66147 45.9476L14.7192 39.865L2.59917 43.383L14.1449 38.2873L1.76444 40.7356L13.7104 36.6655L1.16361 38.0254L13.4189 35.0121L0.801289 35.2733L13.2726 33.3395L0.680201 32.5L13.2725 31.6605L0.801281 29.7267L13.4189 29.9879L1.16362 26.9745L13.7105 28.3344L1.76444 24.2644L14.145 26.7127L2.59917 21.617L14.7192 25.1349L3.66147 19.0524L15.4288 23.6133L4.94325 16.5901L16.2682 22.1592L6.43473 14.2489L17.2313 20.7839L8.12462 12.0466L18.3106 19.4978L10 9.99999L19.4977 18.3105L12.0466 8.12461L20.7839 17.2313L14.2489 6.43474L22.1593 16.2683L16.5901 4.94323L23.6133 15.4287L19.0524 3.66145L25.135 14.7192L21.617 2.59916L26.7127 14.1449L24.2644 1.76443L28.3344 13.7104L26.9745 1.1636L29.9879 13.4189L29.7267 0.801281L31.6605 13.2725L32.5 0.680188L33.3395 13.2725L35.2733 0.801286L35.0121 13.4189L38.0255 1.16361L36.6656 13.7104L40.7356 1.76442L38.2873 14.1449L43.383 2.59915L39.865 14.7192L45.9476 3.66146L41.3867 15.4288L48.4099 4.94324L42.8407 16.2683L50.7511 6.43474L44.2161 17.2313L52.9534 8.12462L45.5023 18.3105L55 9.99999Z"
        />
      </svg>
    </div>
  );
};
