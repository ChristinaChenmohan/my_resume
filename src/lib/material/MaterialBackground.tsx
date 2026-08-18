import { useEffect, useRef, useState, type ReactNode } from "react";
import { MaterialEngine } from "./material-engine";
import { MaterialContext, type MaterialApi } from "./material-context";

/**
 * The dynamic material backdrop: a fixed WebGL "digital sculpture" sheet
 * behind the page content.
 *
 * When WebGL is unavailable or the context is lost, a lightweight CSS
 * material takes over — same warm paper palette, paper grain, and a soft
 * virtual light that still drifts after the pointer with inertia. It never
 * degrades to a dead, flat color.
 */
export function MaterialBackground({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<MaterialEngine | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let engine: MaterialEngine | null = null;
    try {
      engine = new MaterialEngine(canvas);
      engineRef.current = engine;
    } catch (error) {
      console.warn("[material] WebGL unavailable — using CSS material fallback.", error);
      setFallback(true);
    }
    return () => {
      engine?.dispose();
      engineRef.current = null;
    };
  }, []);

  // If the GPU loses the WebGL context mid-session, fall back gracefully.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || fallback) return;
    const onLost = (e: Event) => {
      e.preventDefault();
      console.warn("[material] WebGL context lost — switching to CSS material fallback.");
      engineRef.current?.dispose();
      engineRef.current = null;
      setFallback(true);
    };
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [fallback]);

  const apiRef = useRef<MaterialApi>({
    pressAt: (clientX, clientY, radiusPx, strength) => {
      engineRef.current?.pressAt(clientX, clientY, radiusPx, strength);
    },
  });

  return (
    <MaterialContext.Provider value={apiRef.current}>
      {fallback ? (
        <MaterialFallback ref={fallbackRef} />
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 size-full"
        />
      )}
      <div className="relative z-10">{children}</div>
    </MaterialContext.Provider>
  );
}

/**
 * CSS-only material: warm paper sheet + grain, with a soft virtual light
 * that follows the pointer slowly (inertia), so the surface visibly reacts
 * even without WebGL.
 */
function MaterialFallback({ ref }: { ref: React.Ref<HTMLDivElement> }) {
  const lightRef = useRef({ x: 0.5, y: 0.45, tx: 0.5, ty: 0.45, last: -Infinity });
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    const el = (ref as React.RefObject<HTMLDivElement | null>).current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const l = lightRef.current;
      l.tx = e.clientX / window.innerWidth;
      l.ty = e.clientY / window.innerHeight;
      l.last = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const frame = (now: number) => {
      const l = lightRef.current;
      const reduced =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Idle drift after 4s without the pointer (not under reduced motion).
      if (!reduced && performance.now() - l.last > 4000) {
        l.tx = 0.5 + Math.sin(now * 0.00006) * 0.09;
        l.ty = 0.45 + Math.cos(now * 0.00005) * 0.07;
      }
      const prev = tRef.current ?? now;
      const k = 1 - Math.exp(-((now - prev) / 1000) * 1.4);
      if (Number.isFinite(k)) {
        l.x += (l.tx - l.x) * Math.max(0, Math.min(1, k));
        l.y += (l.ty - l.y) * Math.max(0, Math.min(1, k));
      }
      el.style.setProperty("--mat-lx", l.x.toFixed(4));
      el.style.setProperty("--mat-ly", l.y.toFixed(4));
      tRef.current = now;
      requestAnimationFrame(frame);
    };
    const raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="material-fallback pointer-events-none fixed inset-0 z-0"
    />
  );
}
