import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Polyfill for Three.js r170 frustum culling compatibility with bundled globe objects
if (typeof Object.prototype !== 'undefined' && !(Object.prototype as any).intersectsFrustum) {
  Object.defineProperty(Object.prototype, 'intersectsFrustum', {
    value: function (frustum?: any) {
      if (frustum && typeof frustum.intersectsObject === 'function') {
        try {
          return frustum.intersectsObject(this);
        } catch {
          return true;
        }
      }
      return true;
    },
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

// Polyfill for Three.js r170 determinantAffine compatibility with bundled Matrix4 objects
if (typeof Object.prototype !== 'undefined' && !(Object.prototype as any).determinantAffine) {
  Object.defineProperty(Object.prototype, 'determinantAffine', {
    value: function () {
      const te = (this as any).elements;
      if (!te || te.length < 11) return 1;
      const n11 = te[0], n12 = te[4], n13 = te[8];
      const n21 = te[1], n22 = te[5], n23 = te[9];
      const n31 = te[2], n32 = te[6], n33 = te[10];
      return n11 * (n22 * n33 - n23 * n32) - n12 * (n21 * n33 - n23 * n31) + n13 * (n21 * n32 - n22 * n31);
    },
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

createRoot(document.getElementById('root')!).render(<App />);
