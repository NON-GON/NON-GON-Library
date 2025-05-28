import { Vector3 } from "../../Calc/Util/Utils";
import { IGeometry3D } from "../3D/IGeometry3D";
import { GeometryType2D } from "../GeoTypes";

export interface IGeometry2D {
  readonly center: Vector3;
  readonly segments: number;
  readonly type: GeometryType2D;
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
   * Retrieves the type of the geometry as defined in the GeometryType2D enum.
   *
   * This function provides the specific type of the geometry.
   * @returns {GeometryType2D} The type of the geometry.
   */
  getType(): GeometryType2D;
  /**
   * Retrieves the segments of the geometry.
   * @returns {number} The number of segments in the geometry.
   */
  getSegments(): number;
  /**
   * Returns the points of contact between two geometries.
   * @returns {[Vector3,Vector3]} points of contact.
   */
  ShortestDistance(geometry: IGeometry2D | IGeometry3D): [Vector3, Vector3];
  /**
   * Returns a boolean indicating if the geometry is overlapping with one another geometry.
   * @returns {boolean} true if the geometries are overlapping, false otherwise.
   */
  ProximityQuery(geometry: IGeometry2D | IGeometry3D, method?: string): boolean;
}
