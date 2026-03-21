declare module '@studio-freight/react-lenis' {
  import { ReactNode } from 'react';

  export interface LenisOptions {
    lerp?: number;
    duration?: number;
    smoothWheel?: boolean;
    [key: string]: any;
  }

  export interface ReactLenisProps {
    root?: boolean;
    options?: LenisOptions;
    children: ReactNode;
  }

  export const ReactLenis: React.FC<ReactLenisProps>;
}
