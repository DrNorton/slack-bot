import { RGBColor } from 'react-color';

export default function hexToRgb (hex: string): RGBColor {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            a: 1,
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : { a: 1, r: 0, g: 0, b: 0 };
}

export function hexToRgbString (hex: string): string {
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return r + ',' + g + ',' + b;
}
