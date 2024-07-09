// This makes a theoretical fine AB and finds a point with and offset t on the line AB
function lerp(A, B, t) {
    return A + (B - A) * t
}
// This is effectively making a system of equations from the equations of the lines of AB and CD, and solving our system of equations
function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length]
            )
            if (touch) {
                return true;
            }
        }
    }
    return false;
}

const getRGBA = (value) => `rgba(${value < 0 ? 0 : 255},${value < 0 ? 0 : 255},${value < 0 ? 255 : 0}, ${Math.abs(value)})`