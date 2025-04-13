import React, { useEffect, useRef, useState } from 'react';
import { debounce } from '../utils/performance';

interface VirtualScrollProps {
  items: any[];
  itemHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  containerHeight: number;
  overscan?: number;
}

export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  itemHeight,
  renderItem,
  containerHeight,
  overscan = 3,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const handleScroll = debounce((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, 16);

  const visibleItemsData = items.slice(startIndex, endIndex);

  return (
    <div
      ref={containerRef}
      className="virtual-scroll-container"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItemsData.map((item, index) => (
          <div
            key={startIndex + index}
            className="virtual-scroll-item"
            style={
              {
                height: itemHeight,
                top: (startIndex + index) * itemHeight,
                '--virtual-scroll-offset': `${(startIndex + index) * itemHeight}px`,
              } as React.CSSProperties
            }
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
};

// パフォーマンス最適化のためのユーティリティ
export const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(callback, options);
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [callback, options]);

  return observer.current;
};
