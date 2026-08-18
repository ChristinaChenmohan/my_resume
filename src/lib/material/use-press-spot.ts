import { useCallback, type MouseEvent } from "react";
import { useMaterial } from "./material-context";

/**
 * Hooks hover-in / hover-out of an element to a soft material bulge centred
 * on that element. Use on any card, row or node that should "press into" the
 * background sheet with visible inertia.
 */
export function usePressSpot(strength = 0.04, radiusPx = 200) {
  const material = useMaterial();

  return {
    onMouseEnter: useCallback(
      (e: MouseEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        material.pressAt(r.left + r.width / 2, r.top + r.height / 2, radiusPx, strength);
      },
      [material, strength, radiusPx],
    ),
    onMouseLeave: useCallback(
      (e: MouseEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        material.pressAt(r.left + r.width / 2, r.top + r.height / 2, radiusPx, 0);
      },
      [material, radiusPx],
    ),
  };
}
