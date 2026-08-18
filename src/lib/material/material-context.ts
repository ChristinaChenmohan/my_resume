import { createContext, useContext } from "react";

export type MaterialApi = {
  /** Push a slow, inertial bulge (strength > 0) or release one (strength = 0) at a client position. */
  pressAt: (clientX: number, clientY: number, radiusPx: number, strength: number) => void;
};

const NOOP_API: MaterialApi = { pressAt: () => {} };

export const MaterialContext = createContext<MaterialApi>(NOOP_API);

/** Access the material surface from inside <MaterialBackground>. */
export function useMaterial(): MaterialApi {
  return useContext(MaterialContext);
}
