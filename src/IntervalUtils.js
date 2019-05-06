/**
 Copyright Daniela Maftuleac 2019.
 */

var Algo = require('./IntervalUtils');
var IntervalTree = require('./IntervalTree.js');
var Node = require('./Node.js');

/**
 * Given two interval trees `tree1` and `tree2`, returns a new interval tree with
 * the nodes corresponding to the common overlapping intervals of both trees.
 * This is done by checking each node from the 'tree`' for all overlapping intervals
 * with all nodes of `tree2`.
 *
 * @param tree1, tree2 The trees to search for overlaps between their intervals.
 * @returns {IntervalTree} The created interval tree containing common subintervals
 *                         from `tree1` and `tree2`.
 */
exports.intersection = function (tree1, tree2) {
    // Check if the input data is valid.
    if (!tree1 instanceof IntervalTree || !tree2 instanceof IntervalTree) {
        throw new Error("Unexpected non-tree argument");
    }

    // Initialize the returning interval tree.
    let res = new IntervalTree();

    // Initialize the queue
    let queue = [];

    // Add the root node of tree1 to the queue.
    queue.push(tree1.root);

    while (queue.length !== 0) {
        // Traverse all the nodes of tree1.
        let current = queue.shift();

        if (current !== undefined) {
            // Store in an array the nodes who's interval are intersections of the current node from tree1
            // with nodes's intervals from tree2.
            let overlappingIntervals = tree2.overlapSearch(current);

            // If any overlapping intervals were found, insert the created nodes with such intervals in
            // the resulting interval tree.
            if (overlappingIntervals !== undefined) {
                overlappingIntervals.forEach(function (element) {
                    res.insert(element);
                });
            }
            queue.push(current.left);
            queue.push(current.right);
        }
    }
    return res;
};

/**
 * Computes the interval tree of the common overlaps of all trees the input array
 * by considering consecutive interval trees for the common overlaps.
 *
 * Example: trees[1] = intersection(trees[0], trees[1])
 *          trees[2] = intersection(trees[1], trees[2])
 *              ...
 *          trees[n-1] = intersection(trees[n-2], trees[n-1])
 * The solution is trees[n-1].
 *
 * @param trees The input array of all interval trees to search for common overlapping intervals.
 * @returns {*} The interval tree with intervals that are common overlapping intervals for all trees in `trees`.
 */
exports.findSolution = function (trees) {
    // Check if the input data is valid.
    if (!trees instanceof Array) {
        throw new Error("Unexpected non-array argument: " + trees);
    }

    // Initialize the resulting interval tree as the first interval ttee from the input array.
    let res = trees[0];

    // The resulting interval tree is computed as the intersection interval tree with the next tree from the input array.
    for (let i = 1; i < trees.length; i++) {
        res = Algo.intersection(res, trees[i]);
    }
    return res;
};


/**
 * Checks if this tree contains the same intervals as the tree `tree`.
 * In this case, we consider the tree to be equivalent.
 * This method if used for testing purposes.

 * @param tree1, tree2 The trees to compare.
 */
exports.equivalentTrees = function (tree1, tree2) {
    // Check if the input data is valid.
    if (!(tree1 instanceof IntervalTree && tree2 instanceof IntervalTree)) {
        throw new Error("Unexpected non-tree argument");
    }

    // If the trees have different number of nodes, they are not equivalent.
    if (tree1.size !== tree2.size) {
        return false;
    }

    // Collect in array the intervals values (in-order by low value) from tree1.
    let intervals1 = tree1.collectIntervals();
    // Collect in array the intervals values (in-order by low value) from tree2.
    let intervals2 = tree2.collectIntervals();

    // Compare if the collected arrays are equal.
    for (let i = 0; i < intervals1.length; i++) {
        if (intervals1[i] != intervals2[i]) {
            return false;
        }
    }
    return true;
};

/**
 * Checks if tree rooted in `node` is a valid interval tree.
 * This is done by checking if all the nodes of the tree are instances of class `Node`.
 * This method if used for testing purposes.

 * @param node The root of the tree.
 * @returns {boolean|boolean|*} true if all nodes are instances of `Node` class, and false otherwise.
 */
exports.isTreeNode = function (node) {
    // Check if the input data is valid.
    if (!node instanceof Node) {
        throw new Error("Unexpected non-node argument: " + node);
    }

    // Empty interval tree is a valid interval tree.
    if (node === undefined) {
        return true;
    }
    return (Algo.isTreeNode(node.left) && Algo.isTreeNode(node.right));
};

/**
 * Checks the tree integrity, i.e., that all nodes are instances of `Node` class,
 * by calling the recursive method `isTreeNode`.
 * This method if used for testing purposes.
 *
 * @param tree An interval tree.
 * @returns {*} Calls the recursive function `isTreeNode`.
 */
exports.isTree = function (tree) {
    // Check if the input data is valid.
    if (!tree instanceof IntervalTree) {
        throw new Error("Unexpected non-tree argument: " + tree);
    }
    if(tree === undefined) {
        return true;
    }
    return (Algo.isTreeNode(tree.root));
};

module.exports = Algo;
