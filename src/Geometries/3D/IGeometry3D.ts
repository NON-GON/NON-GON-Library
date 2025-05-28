import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry2D } from "../2D/IGeometry2D";
import { GeometryType3D } from "../GeoTypes";

export interface IGeometry3D {
  readonly center: Vector3;
  readonly segments: number;
  readonly type: GeometryType3D;
  readonly geometry: any;
  rotation: Vector3;
  /** Function to get the geometry
   * This function calculates each point of the geometry and returns a BufferGeometry object.
   * @returns {BufferGeometry} The geometry of the object.
   */
  getGeometry(): any;
  /** Function to get the center points of the geometry
   * @returns {Vector3[]} The points of the object.
   */
  getCenter(): Vector3;
  /** Function to get the rotation points of the geometry in degrees
   * @returns {Vector3[]} The points of the object.
   */
  getRotation(): Vector3;
  /**
   * Retrieves the type of the geometry as defined in the GeometryType3D enum.
   *
   * This function provides the specific type of the geometry.
   * @returns {GeometryType3D} The type of the geometry.
   */
  getType(): GeometryType3D;
  /**
   * Retrieves the segments of the geometry.
   * @returns {number} The number of segments in the geometry.
   */
  getSegments(): number;
  /**
   * Calculates the Shortest distance between the current geometry and another geometry.
   * @param {IGeometry3D | IGeometry2D} geometry - The geometry to compare against.
   * Can be either a 3D geometry implementing the IGeometry3D interface or a 2D geometry implementing the IGeometry2D interface.
   * @returns {[Vector3, Vector3]} An array containing two points:
   * - The closest point on the current geometry.
   * - The closest point on the input geometry.
   */
  ShortestDistance(geometry: IGeometry3D | IGeometry2D): [Vector3, Vector3];

  /**
   * Checks if the current geometry is overlapping or in close proximity to another geometry.
   * @param {IGeometry3D | IGeometry2D} geometry - The geometry to compare against.
   * Can be either a 3D geometry implementing the IGeometry3D interface or a 2D geometry implementing the IGeometry2D interface.
   * @param {string} [method] - (Optional) The algorithm or method to use for the proximity query.
   * If not provided, a default method is used.
   * @returns {boolean} True if the geometries are overlapping or in close proximity, false otherwise.
   */
  ProximityQuery(geometry: IGeometry3D | IGeometry2D, method?: string): boolean;
}
