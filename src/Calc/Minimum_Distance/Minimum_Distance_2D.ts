import * as THREE from "three";
import { GeometryCreator } from "../../Geometries/GeometryCreator";
import { EuclideanDistance, quarticRoots } from "../Util/Utils";



export function pointEllipseObj(point: [number, number],ellipse: GeometryCreator): {x:number,y:number} {
  let res = [[Number, Number], [Number, Number]];
  let T = { x: 0, y: 0 }; // Closest point on the ellipse

  let a = ellipse.xradius;
  let b = ellipse.yradius;

  // Transform the query point to a new system of coordinates relative to the ellipse
  //Vector2 Point_ = Ellipse.transform.InverseTransformPoint(Point);
  let s1 = point[0];
  let s2 = point[1];

  T = pointEllipse(Point_,a,b);
  // T = Ellipse.transform.TransformPoint(T);
  
  res[0] = [Point[0], Point[1]];
  res[1] = [T.x, T.y];

  return res;


}

export function pointEllipse(point: [number, number], a: number, b: number):  [number, number] {
  let pointObj = { x: point[0], y: point[1] };
  let T = { x: 0, y: 0 }; // Closest point on the ellipse

  // Transform the query point to a new system of coordinates relative to the ellipse
  let s1 = pointObj.x;
  let s2 = pointObj.y;

  let multy = 1;
  let multx = 1;

  if (s2 < 0) {
      s2 = -s2;
      multy = -1;
  }

  if (s2 > 0) {
      if (s1 < 0) {
          s1 = -s1;
          multx = -1;
      }
      if (s1 > 0) {
          let a2 = a * a;
          let b2 = b * b;
          let s12 = s1 * s1;
          let s22 = s2 * s2;
          let z0 = -a2 * a2 * b2 * b2 + a2 * s12 * b2 * b2 + s22 * b2 * a2 * a2;
          let z1 = 2 * b2 * s12 * a2 + 2 * a2 * b2 * s22 - 2 * a2 * b2 * b2 - 2 * b2 * a2 * a2;
          let z2 = a2 * s12 + b2 * s22 - b2 * b2 - a2 * a2 - 4 * a2 * b2;
          let z3 = -2 * (b2 + a2);
          
          // Solve quartic equation
          let roots = quarticRoots(-1, z3, z2, z1, z0);
          
          // Find the largest valid root
          let t = -Infinity;
          for (let r = 0; r < roots.length; r++) {
              if (t < roots[r] && !Number.isNaN(roots[r])) {
                  t = roots[r];
              }
          }
          
          T.x = (a * a * s1) / (t + a * a);
          T.y = (b * b * s2) / (t + b * b);
      } else {
          T.x = 0;
          T.y = b;
      }
  } else {
      if (s1 < (a * a - b * b) / a) {
          T.x = (a * a * s1) / (a * a - b * b);
          T.y = b * Math.sqrt(1 - (T.x / a) * (T.x / a));
      } else {
          T.x = a;
          T.y = 0;
      }
  }
  
  T.x = T.x * multx;
  T.y = T.y * multy;
  
  return [T.x, T.y];
}


export function ellipseEllipse(ellipse1: any, ellipse2:any) {
  let tol = 0.1;
  let p1 = [ellipse1.position.x, ellipse1.position.y];
  let p2 = pointEllipse()
  let distance = EuclideanDistance(p1, p2);
  while(true){

  }
}