import BinarySearchTree from "../utility/bst.js";

/**
 * A data structure that stores an array of objects as keys in a Map, with their values holding an array
 * indicating some kind of connection to the other keys. This graph's edges are one-directional
 */
export class Graph {

    multidirectional = true;
    
    /**
     * Constructs a graph from no parameters, only vertices, or vertices and edges.
     * @param {*} vertices An array of objects to use as vertices. If these objects contain the properties
     *      'name,' 'x,' and 'y,' they will be able to be displayed using the GraphView class.
     * @param {*} edges An array of arrays that contain the two indices of the vertices that 
     *      have an incident edge.
     */
    constructor(multidirectional = true, vertices, edges) {
    
        this.verticies = [];
        this.neighbors = new Map();
        this.setEdgeMultidirectional(multidirectional);

        // Adds vertices if passed in
        if (vertices != undefined) {
            this.addVertices(vertices);
        }

        // Adds edges if passed in
        if (edges != undefined) {
            this.addEdges(edges);
        }
    }

    /**
     * Sets whether edges are additionally added from the second vertex to the first (muiltidirectional)
     * or only added the direction specified.
     * 
     * @param {boolean} multidirectional A boolean value indicating whether edges added go both ways or only the
     * first vertex to the second.
     */
    setEdgeMultidirectional (multidirectional) {
        this.multidirectional = multidirectional;
    }

    /**
     * Gets a vertex at the specified index.
     * 
     * @param {*} v the (relative) index of a vertex within neighbors.keys(), whose value is determined by
     *      the order elements were inserted and flunctuates on the deletion of previously inserted keys.
     * @returns the vertex at the relative index within neighbors.keys()
     */
    vertexAt(i) {
        if (i < 0 || i >= this.verticies.length) {
            throw new TypeError("Index " + i + " not within length of total vertices.");
        }

        return this.verticies[i];
    }

    /**
     * Gets the index of the specified vertex.
     * 
     * @param {*} v the vertex to retrieve the index of.
     * @returns the index, if found, or -1 if not.
     */
    indexOf(v) {
        let count = 0;
        for (let vertex of this.verticies) {
            if (vertex === v) {
                return count;
            }
            count++;
        }

        return -1;
    }

    /**
     * Adds a vertex to the graph.
     * 
     * @param {*} v the vertex to add.
     */
    addVertex(v) {
        this.verticies.push(v);
        this.neighbors.set(v.id, new BinarySearchTree());
    }

    /**
     * Adds an array of vertice objects to the graph.
     * 
     * @param {*} vertices an array of the vertices to add.
     */
    addVertices (vertices) {
        if (!(Array.isArray(vertices))) {
            throw new TypeError("param 'vertices' must be an Array.");
        } else {
            for (let vertex of vertices) {
                this.addVertex(vertex);
            }
        }
    }

    /**
     * Adds an edge to the graph, passing either the vertices themselves or the relative 
     * indices to the vertices.
     * 
     * @param {*} u the first vertex of the edge, or the relative index to the vertex.
     * @param {*} v the second vertex, or the relative index to the vertex.
     * @returns true if the insertion was a success and false if not.
     */
    addEdge(u, v, weight = null) {

        // adding by element
        if (isNaN(u) && isNaN(v)) {

            if (this.neighbors.has(u.id) && this.neighbors.has(v.id)) {

                this.neighbors.get(u.id).insert(v.id, weight);
                if (this.multidirectional) {
                    this.neighbors.get(v.id).insert(u.id, weight);
                }

                return true;
            }

        // adding by relative index
        } else { 
            if (u < 0 || u >= this.neighbors.size) {
                console.log("couldn't add 'u' " + u + ": index out of bounds");
                return -1;
            }
            if (v < 0 || v >= this.neighbors.size) {
                console.log("couldn't add 'v' " + v + ": index out of bounds");
                return -1;
            }

            let v1 = this.vertexAt(u);
            let v2 = this.vertexAt(v);

            this.neighbors.get(v1.id).insert(v2.id, weight);
            if (this.multidirectional) {
                this.neighbors.get(v2.id).insert(v1.id, weight);
            }

            return true;
        }

        return false;
    }

    addEdges (edges) {
        if (!(Array.isArray(edges))) {
            throw new TypeError("param \'edges\' must be an Array.");
        } else {
            for (let edge of edges) {
                if (Array.isArray(edge)) {
                    this.addEdge(edge[0], edge[1], (edge[2]) ? edge[2] : undefined);
                } else {
                    this.addEdge(edge.u, edge.v, (edge.weight) ? edge.weight : undefined);
                }
            }
        }
    }

    /**
     * Removes a vertex from the graph by a parameter of either the vertex itself or the 
     * relative index of the vertex.
     * 
     * @param {*} v The vertex or index of the vertex to remove.
     * @returns true if the element was successfully removed and false if not.
     */
    removeVertex(v) {

        let vertex = (isNaN(v)) ? v : this.vertexAt(v);

        if (!(this.neighbors.has(v.id))) {
            throw new TypeError("v must be a vertex in the graph or an index to one.")
        }

        var found = false;
        for (let edges of this.neighbors.get(vertex.id)) {

            let neighborsEdges = this.neighbors.get(edges.v.id);
            for (let i = 0; i < neighborsEdges.length; i++) {
                if (neighborsEdges[i].v == vertex) {
                    found = true;
                }
                if (found && i != neighborsEdges.length - 1) {
                    neighborsEdges[i].v = neighborsEdges[i + 1].v;
                }
            }

            neighborsEdges.length = neighborsEdges.length - 1;
            found = false;
        }

        this.neighbors.delete(vertex.id);
        this.verticies.find((v, i, arr) => {
            if (v == vertex) {
                arr.splice(i, i);
                return true;
            }
        });
        
        return true;
    }

    /**
     * Removes an edge from the graph.
     * @param {*} u the first index of the vertex the edge is to incident to.
     * @param {*} v the second index the edge is to incident to.
     * @returns true if successfully removed and false if not.
     */
    removeEdge(u, v) {

        let v1 = u;
        let v2 = v;

        // remove by relative index of insertion order
        if (typeof u == 'number' && typeof v == 'number') {
            if (u < 0 || u >= this.neighbors.size) {
                console.log("u cannot be removed because it does not exist.");
            }
            if (v < 0 || v >= this.neighbors.size) {
                console.log("v cannot be removed because it does not exist.");
            }

            v1 = this.vertexAt(u);
            v2 = this.vertexAt(v);
        }

        if (this.neighbors.has(v1.id) && this.neighbors.has(v2.id)) {

            let vertices = (this.multidirectional) ? [v1] : [v1, v2];

            for (let vertex of vertices) {
                let edges = this.neighbors.get(vertex.id);

                for (let i = edges.length; i >= 0; i--) { 
                    if (edges[i].v === v2) {
                        edges[i].splice(i, i);
                        break; // doesn't check for duplicates in edges
                    }
                }
            }
            
            return true;
        }

        return false;
    }

    /**
     * Returns a vertex by index or its 'id' property as a String if existing. Returns false otherwise.
     * 
     * @param {*} v The index of the vertex as a Number or 'id' of the vertex as a String.
     * @returns The vertex if existing. Otherwise, returns false.
     */
    getVertex(v) {

        if (typeof v == 'number') return this.verticies[v];
        else if (typeof v == 'string') return this.verticies.find(vertex => v == vertex.id);

        return false;
    }

    /**
     * Returns all of the vertices of the graph in an array.
     * 
     * @returns The vertices of the graph as an array.
     */
    getVertices () {
        return JSON.parse(JSON.stringify(this.verticies));
    }

    /**
     * Returns the neighboring vertices of a vertex.
     * 
     * @param {*} v The index of the vertex as a Number, the 'id' of the vertex as a String, 
     * or the vertex itself.
     * @returns The neighboring 'id's of the vertex as an array in ascending order.
     */
    getVertexNeighbors(v) {
        if (typeof v == 'number') return this.neighbors.get(this.getVertex(v).id).inorder();
        else if (typeof v == 'string') return this.neighbors.get(v.id).inorder();
        else if (v.hasOwnProperty('id')) return this.neighbors.get(v.id).inorder();

        return false;
    }

    /**
     * Returns all of the neighbors of every vertex in the graph in an array.
     * 
     * @returns The neighboring arrays of all the vertices within an array.
     */
    getNeighbors () {
        return JSON.parse(JSON.stringify([...this.neighbors.values()]));
    }

    /**
     * Returns the number of vertices in the graph.
     * 
     * @returns The size of the number of vertices in the graph.
     */
    getSize() {
        return this.neighbors.size;
    }

    /**
     * Returns the 'weight' (or distance) of an edge (connection) in the graph if the edge has a weight.
     * @param {*} u The first connecting vertex of the connection, using a relative index or the actual 
     * vertex itself.
     * @param {*} v The second connecting vertex of the connection, using a relative index or the actual 
     * vertex itself.
     * @returns The 'weight' (i.e. distance) of the edge.
     */
    getWeight(u, v) {
        if (typeof u == 'number' && typeof v == 'number') {
            if (u < 0 || u >= this.neighbors.size) {
                console.log("Cannot get weight of edge with u because " + u + " is not within index bounds.");
            }
            if (v < 0 || v >= this.neighbors.size) {
                console.log("Cannot get weight of edge with v because " + v + "is not within index bounds.");
            }

            u = this.vertexAt(u);
            v = this.vertexAt(v);
        }

        for (let edge of this.neighbors.get(u.id)) {
                if (edge.id == v.id) {
                    return edge.weight;
                }
        }

        return null;
    }

    isDisplayable () {
        return this.getVertices().every((val) => 'x' in val && 'y' in val && 'name' in val);
    }

    hasVertexInRadius (point, radius) {
        for (let [v, neighs] of this.neighbors) {
            let vDistance = Math.sqrt((point.x - v.x) * (point.x - v.x) + (point.y - v.y) * (point.y - v.y));
            if (vDistance <= radius) {
                return v;
            }
        }

        return null;
    }

    setVertexName(v, name) {
        if (this.neighbors.has(v)) Object.defineProperty(v, 'name', {value: name});
    }

    setWeight(u, v, weight) {
        if (typeof u == 'number' && typeof v == 'number') {
            if (u < 0 || u >= this.neighbors.size) {
                console.log("Cannot get weight of edge with u because " + u + " is not within index bounds.");
            }
            if (v < 0 || v >= this.neighbors.size) {
                console.log("Cannot get weight of edge with v because " + v + "is not within index bounds.");
            }

            u = this.vertexAt(u);
            v = this.vertexAt(v);
        }

        for (let edge of this.neighbors.get(u.id)) {
            if (edge.v == v) {
                Object.defineProperty(edge, 'weight', {value: weight});
            }
        }
        for (let edge of this.neighbors.get(v.id)) {
            if (edge.v == u) {
                Object.defineProperty(edge, 'weight', {value: weight});
                return true;
            }
        }

        return false;
    }

    print() {
        var i = 0;
        this.neighbors.forEach((edges, vertex) => {
            let edgesString = (edges.length == 0) ? "-" : edges.reduce((prev, curr) => (prev.v) ? prev.v.id : prev + ", " + curr.v.id);
            console.log("vertex[" + vertex.id + "]: x: " + vertex.x + ", y: " + vertex.y + " -> " + edgesString);
            i++;
        });
    }

    dfs(v) {
        if (typeof v == 'number') {
            v = this.vertexAt(v);
        }
        if (v == null) {
            throw new TypeError("Must pass in a vertex or an index to a vertex to search the graph.");
        }

        var visited = {};
        var searchOrder = [];
        var parent = {};

        this.dfsRecursive(v, parent, searchOrder, visited);

        return new SearchTree(v, parent, searchOrder);
    }

    dfsRecursive(vertex, parent, searchOrder, visited) {
        searchOrder.push(vertex);
        visited[JSON.stringify(vertex)] = true;

        let neighbors = this.neighbors.get(vertex);

        for (let neighbor of neighbors) {
            if (!visited[JSON.stringify(neighbor.v)]) {
                parent[JSON.stringify(neighbor.v)] = JSON.stringify(vertex);
                this.dfsRecursive(neighbor.v, parent, searchOrder, visited);
            }
        }
    }

    bfs(v) {
        if (typeof v == 'number') {
            v = this.vertexAt(v);
        }
        if (v == null) {
            throw new TypeError("Must pass in a vertex or an index to a vertex to search the graph.");
        }

        var searchOrder = [];
        var parents = {};
        var queue = [v];
        var visited = {};
        visited[JSON.stringify(queue[0])] = true;
        
        while (queue.length != 0) {
            let u = queue.shift();
            let neighbors = this.neighbors.get(u);

            for (let neighbor of neighbors) {
                if (!visited[JSON.stringify(neighbor.v)]) {
                    searchOrder.push(neighbor.v);
                    queue.push(neighbor.v);
                    parents[JSON.stringify(neighbor.v)] = JSON.stringify(u);
                    visited[JSON.stringify(neighbor.v)] = true;
                }
            }
        }

        return new SearchTree(v, parents, searchOrder);
    }

    getMinimumSpanningTree (startingVertex) {
        if (typeof startingVertex === 'number') {
            startingVertex = vertexAt(startingVertex);

            if (startingVertex === null) {
                throw new TypeError("Vertex must be a vertex or an index of " +
                "a vertix in the graph to get a minimum spanning tree.");
            }
        }

        let parents = {};
        var totalWeight = 0;

        let T = [];
        T.push(startingVertex);

        while(T.length < this.getSize()) {
            let u = -1, v = -1;
            let currentMinCost = Number.MAX_VALUE;
            for (let i of T) {
                for (let edge of this.neighbors.get(i)) {
                    if (!T.includes(edge.v) && (edge.weight < currentMinCost)) {
                        currentMinCost = edge.weight;
                        u = i;
                        v = edge.v;
                    }
                }
            }

            if (v == -1) {
                break;
            } else {
                T.push(v);
                parents[JSON.stringify(v)] = JSON.stringify(u);
            }
            totalWeight += currentMinCost;
        }

        return new MST(startingVertex, parents, T, totalWeight);
    }

    getShortestPath(sourceVertex) {

        if (typeof startingVertex === 'number') {
            startingVertex = vertexAt(startingVertex);

            if (startingVertex === null) {
                throw new TypeError("Vertex must be a vertex or an index of " +
                "a vertix in the graph to get its shortest path.");
            }
        }

        let cost = {};
        for (let vertex of this.neighbors.keys()) {
            cost[JSON.stringify(vertex)] = Number.MAX_VALUE;
        }
        cost[JSON.stringify(sourceVertex)] = 0;

        let parents = {};

        let T = [];

        while (T.length < this.getSize()) {
            var u = -1;
            var currentMinCost = Number.MAX_VALUE;

            for (let [vertex, edges] of this.neighbors) {
                if (!T.includes(vertex) && cost[JSON.stringify(vertex)] < currentMinCost) {
                    currentMinCost = cost[JSON.stringify(vertex)];
                    u = vertex;
                }
            }

            if (u == -1) {
                break;
            } else {
                T.push(u);
            }

            for (let edge of this.neighbors.get(u)) {
                if (!T.includes(edge.v) && cost[JSON.stringify(edge.v)] > cost[JSON.stringify(u)] + edge.weight) {
                    cost[JSON.stringify(edge.v)] = cost[JSON.stringify(u)] + edge.weight;
                    parents[JSON.stringify(edge.v)] = JSON.stringify(u);
                }
            }
        }

        return new ShortestPath(sourceVertex, parents, T, cost);
    }
}

class SearchTree {
    root;
    parents;
    searchOrder;

    /**
     * Takes in the root object, array of parents determined in the search, and the order of vertices searched
     * in an array.
     * 
     * @param {*} root 
     * @param {*} parent assumes the array of parent vertices is in JSON stringified form, and parses it
     * @param {*} searchOrder 
     */
    constructor(root, parents, searchOrder) {
        this.root = root;
        this.parents = parents;
        this.searchOrder = searchOrder;
    }

    /**
     * @returns the root vertex.
     */
    getRoot() {
        return JSON.parse(JSON.stringify(this.root));
    }

    /**
     * @returns stringified versions of both the vertex (property) and the parent of that vertex (value).
     */
    getParents() {
        return this.parents;
    }

    /**
     * @returns the number of vertices traversed during the search.
     */
    getNumberOfVerticesFound() {
        return this.searchOrder.length;
    }

    /**
     * 
     * @param {*} vertex the vertex to begin the search
     * @returns 
     */
    getPath(vertex) {

        if (typeof vertex != 'string') {
            vertex = JSON.stringify(vertex);
        }
        let path = [];

        do {
            path.push(vertex);
            vertex = this.parents[vertex];
        } while (this.parents[vertex] != null);

        return path;
    }

    getSearchOrder() {
        return [...this.searchOrder];
    }

    printTree () {
        console.log("Root: " + this.root);
        console.log("Edges: ");

        for (let vertex in this.parents) {
            console.log("(" + this.parents[vertex] + ", " + vertex + ")");
        }
    }
}

class MST extends SearchTree {
    totalWeight;

    constructor(root, parents, searchOrder, totalWeight) {
        super(root, parents, searchOrder);
        this.totalWeight = totalWeight;
    }

    getTotalWeight() {
        return this.totalWeight;
    }
}

class ShortestPath extends SearchTree {
    cost;

    constructor(root, parents, searchOrder, cost) {
        super(root, parents, searchOrder);
        this.cost = cost;
    }

    getCost(v) {
        if (typeof v === 'number') {
            v = vertexAt(startingVertex);

            if (v === null) {
                throw new TypeError("Vertex must be a vertex or an index of " +
                "a vertix in the graph to get its cost.");
            }
        }

        return this.cost[JSON.stringify(v)];
    }
}

export default Graph;
export { SearchTree };