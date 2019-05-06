/**
 Copyright Daniela Maftuleac 2019.
 */

/**
 * Class for interval tree node.
 */
class TreeNode {
    /**
     * Creates a new interval tree node.
     *
     * @param start The left boundary of the interval.
     * @param end The right boundary of the interval.
     */
    constructor(start, end) {
        // Check if the input data is valid.
        if ((start !== undefined && typeof end !== 'number') || (start !== undefined && typeof end !== 'number')) {
            throw new Error("Unexpected non-number argument");
        }
        // Initialize the descendent nodes.
        this.left = undefined;
        this.right = undefined;

        // Initialize the low and high values of the interval corresponding to this node.
        this.low = Math.min(start, end);
        this.high = Math.max(start, end);

        // Initialize the height of the node.
        this.height = 1;

        // Initialize the maximum value of the node,
        // i.e. the highest value of an interval in the subtree rooted at this node.
        this.max = this.high;
    }

    /**
     * Calculates the balance factor (left subtree height minus right subtree height) of this node.
     *
     * @returns {number} The calculated balance factor.
     */
    getBalance() {
        return getHeight(this.left) - getHeight(this.right);
    }

    /**
     * Checks if the input node's interval overlaps with this node's interval.
     *
     * @param Object The input node.
     * @returns {boolean} `true` if the interval of the input node overlaps and `false` otherwise.
     */
    hasOverlap(node) {
        // Check if the input data is valid.
        if (!node instanceof TreeNode) {
            throw new Error("Unexpected non-node argument: " + node);
        }

        // Return false, if the input node is undefined.
        if (node === undefined) {
            return false;
        }

        // Return the common overlap of the two intervals.
        return (this.low <= node.high && node.low <= this.high);
    }

    /**
     * Updates the height of this node.
     */
    updateHeight() {
        this.height = Math.max(getHeight(this.left), getHeight(this.right)) + 1;
    }

    /**
     * Updates the max (the maximum value in the subtree) of this node.
     */
    updateMax() {
        this.max = getMax(this);
    }

    /**
     * Creates a string containing the interval corresponding to this node: "[low, hight]".
     *
     * @returns {string} The created string.
     */
    toString() {
        return "[" + this.low + "," + this.high + "]";
    }

    /**
     * Prints the subtree of this node in-order traversal.
     * This method is used for testing and visualization.
     */
    inorder() {
        if (this.left === undefined) {
            console.log("null");
        } else {
            this.left.inorder();
        }
        console.log(this.toString());
        if (this.right === undefined) {
            console.log("null");
        } else {
            this.right.inorder();
        }
    }
}

/**
 * Calculates the height of the input node.
 * The leaf nodes have height 1, their parent nodes have height 2 and so on.
 * The root node has the height as the height of the tree
 * (i.e. length of the longest path from root to a leaf node).
 *
 * @param node The node to calculate the height.
 * @returns {number} The height of the input node.
 */
function getHeight(node) {
    // Check if the input data is valid.
    if (!node instanceof TreeNode) {
        throw new Error("Unexpected non-node argument: " + node);
    }

    // The height of an undefined node is 0.
    if (node === undefined) {
        return 0;
    }
    // Call the recursive method `updateHeight` to update the height of all nodes
    // in the subtree rooted at node `node`.
    node.updateHeight();
    return node.height;
};

/**
 * Calculates the max value of the input node.
 * The max value of a node is the maximum value of all node's intervals
 * in the subtree with root `node`.
 *
 * @param node
 * @returns {number}
 */
function getMax(node) {
    // Check if the input data is valid.
    if (!node instanceof TreeNode) {
        throw new Error("Unexpected non-node argument: " + node);
    }

    // The max value of an undefined node is 0.
    if (node === undefined) {
        return 0;
    }
    // Calculates recursively the max of the input node `node`.
    return Math.max(getMax(node.left), getMax(node.right), node.max);
};

module.exports = TreeNode;
