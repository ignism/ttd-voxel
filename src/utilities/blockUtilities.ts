import { BufferAttribute, BufferGeometry, Vector3 } from 'three';
import { mergeBufferGeometries } from 'three-stdlib';
/**
 * Get triangle vertices for a wall.
 * @example indices[]:
 * 2 - - - 3
 * | \   / |
 * |   4   |
 * | /   \ |
 * 0 - - - 1
 *
 * @param {number[]} indices
 * @param {boolean[]} vertices
 * @param {boolean[]} neighbourVertices
 * @return {*}  {number[][]}
 */
const getWallTriangles = (indices: number[], vertices: boolean[], neighbourVertices: boolean[]): number[][] => {
  const triangleTable = [
    [0, 1, 4],
    [1, 3, 4],
    [2, 0, 4],
    [3, 2, 4],
  ];

  const triangles = triangleTable
    .filter((vertexIndices) => {
      // filter triangles where all vertices are true
      return vertices[vertexIndices[0]] && vertices[vertexIndices[1]] && vertices[vertexIndices[2]];
    })
    .filter((vertexIndices) => {
      // filter triangles if there is a neighbour triangle missing, so when one member of neighbourVertices equals false
      return !(
        neighbourVertices[vertexIndices[0]] &&
        neighbourVertices[vertexIndices[1]] &&
        neighbourVertices[vertexIndices[2]]
      );
    })
    .map((tableIndices) => {
      return [indices[tableIndices[0]], indices[tableIndices[1]], indices[tableIndices[2]]];
    });

  return triangles;
};

//

const geometryFromTriangles = (blockPosition: Vector3, triangles: number[][]) => {
  const vertexTable = [
    [-0.5, -0.25, -0.5],
    [0.5, -0.25, -0.5],
    [-0.5, -0.25, 0.5],
    [0.5, -0.25, 0.5],

    [-0.5, 0.25, -0.5],
    [0.5, 0.25, -0.5],
    [-0.5, 0.25, 0.5],
    [0.5, 0.25, 0.5],

    [-0.5, 0, 0],
    [0.5, 0, 0],
    [0, 0, -0.5],
    [0, 0, 0.5],
  ];

  const triangleGeometries = triangles.map((vertices) => {
    const position = new Float32Array(
      vertices
        .map((index) => {
          return [
            vertexTable[index][0] + blockPosition.x,
            vertexTable[index][1] + blockPosition.y,
            vertexTable[index][2] + blockPosition.z,
          ];
        })
        .flat()
    );

    const attribute = new BufferAttribute(position, 3);
    const geometry = new BufferGeometry();

    geometry.setAttribute('position', attribute);
    geometry.computeVertexNormals();

    return geometry;
  });

  return mergeBufferGeometries(triangleGeometries);
};

export { getWallTriangles, geometryFromTriangles };
