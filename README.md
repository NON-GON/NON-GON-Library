# NON-GON: A Non-Polygonal Collision Detection Library for Real-Time Queries Between Smooth Convex Shapes

**NON-GON** is a curated library of analytical functions for computing shortest distances and proximity queries between smooth convex shapes in real time. Designed for applications in game engines, physics-based simulations, and interactive systems, NON-GON focuses on **non-polygonal geometries**—offering a high-precision, memory-efficient alternative to mesh-based approaches.

---

## 🔷 Supported Shapes

### 2D:
- **Point**
- **Line Segment**
- **Circle**
- **Ellipse**
- **Superellipse**
- **General Smooth Convex Shape**

### 3D:
- **Point**
- **Plane**
- **Ellipsoid**
- **Superellipsoid**
- **Cylinder**
- **Hyperboloid**
- **Elliptic Paraboloid**
- **Strictly Convex Shapes**

---

## 🔶 Available Queries

### 2D Closest Distance:
- **Point – Ellipse**
- **Ellipse – Ellipse**
- **Superellipse – Line Segment**
- **Smooth Convex – Line Segment**
- **Almost Convex/Concave – Circle**
- **Ellipse – Ellipse** (Distance of Closest Approach)

### 3D Closest Distance:
- **Point – Ellipsoid**
- **Ellipsoid – Ellipsoid**
- **Superellipsoid – Plane**
- **Strictly Convex – Plane**
- **Ellipsoid – Ellipsoid** (Distance of Closest Approach)

### 2D Proximity Queries:
- **Ellipse – Ellipse**

### 3D Proximity Queries:
- **Ellipsoid – Ellipsoid**
- **Cylinder – Cylinder**
- **Hyperboloid – Plane**
- **Ellipsoid – Elliptic Paraboloid**

---

## 🔧 Tech Stack
- **TypeScript + Three.js** – Web-based visualizations  
- **C# + Unity** – Game engine integration

---

Explore the potential of **analytic contact geometries**—no meshes, no polygons, just math.
