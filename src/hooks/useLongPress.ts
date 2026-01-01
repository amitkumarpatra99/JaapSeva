import { useCallback, useRef, useState } from "react";

interface LongPressOptions {
  shouldPreventDefault?: boolean;
  delay?: number;
}

export default function useLongPress(
  onLongPress: () => void,
  onClick: () => void,
  { shouldPreventDefault = true, delay = 300 }: LongPressOptions = {}
) {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>(null);
  const target = useRef<EventTarget>(null);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener(
          "touchend",
          preventDefault,
          { passive: false }
        );
        target.current = event.target;
      }
      
      timeout.current = setTimeout(() => {
        onLongPress();
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      
      if (shouldTriggerClick && !longPressTriggered) {
        onClick();
      }
      
      setLongPressTriggered(false);
      
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  );

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
  };
}

const preventDefault = (e: Event) => {
  if (!isTouchEvent(e)) return;
  if (e.touches.length < 2 && e.preventDefault) {
    e.preventDefault();
  }
};

const isTouchEvent = (e: Event): e is TouchEvent => {
  return "touches" in e;
};
