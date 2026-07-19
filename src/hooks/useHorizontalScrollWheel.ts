import { useEffect, useRef } from "react";
import { Platform, ScrollView } from "react-native";

export function useHorizontalScrollDrag() {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const scrollViewRef = scrollRef.current;
    if (!scrollViewRef) return;

    let node: HTMLElement | null = null;

    const attach = () => {
      node = scrollViewRef.getScrollableNode?.() as HTMLElement | null;
      if (!node) return;

      node.style.cursor = "grab";

      const handleWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && e.deltaY !== 0) {
          e.preventDefault();
          node!.scrollLeft += e.deltaY;
        }
      };

      let isDragging = false;
      let startX = 0;
      let scrollLeftStart = 0;

      const handlePointerDown = (e: PointerEvent) => {
        isDragging = true;
        startX = e.clientX;
        scrollLeftStart = node!.scrollLeft;
        node!.style.cursor = "grabbing";
        node!.style.userSelect = "none";
        node!.setPointerCapture(e.pointerId);
      };

      const handlePointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        node!.scrollLeft = scrollLeftStart + (startX - e.clientX);
      };

      const handlePointerUp = (e: PointerEvent) => {
        if (!isDragging) return;
        isDragging = false;
        node!.style.cursor = "grab";
        node!.style.userSelect = "";
        node!.releasePointerCapture(e.pointerId);
      };

      node.addEventListener("wheel", handleWheel, { passive: false });
      node.addEventListener("pointerdown", handlePointerDown);
      node.addEventListener("pointermove", handlePointerMove);
      node.addEventListener("pointerup", handlePointerUp);
      node.addEventListener("pointercancel", handlePointerUp);

      return () => {
        node?.removeEventListener("wheel", handleWheel);
        node?.removeEventListener("pointerdown", handlePointerDown);
        node?.removeEventListener("pointermove", handlePointerMove);
        node?.removeEventListener("pointerup", handlePointerUp);
        node?.removeEventListener("pointercancel", handlePointerUp);
      };
    };

    const cleanup = attach();
    return () => cleanup?.();
  }, []);

  return scrollRef;
}
