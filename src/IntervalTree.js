/**
 Copyright Daniela Maftuleac 2019.
 */

let Node = require('./Node.js');

/**
 * Class for the Interval Tree.
 */
class IntervalTree {
    /**
     * Creates a new Interval Tree with the root node `root`.
     *
     * @param root The root node of the tree to create.
     */
    constructor(root) {
        // Check if the input data is valid.
        if (!root instanceof Node) {
            throw new Error("Unexpected non-node argument: " + root);
        }
        // Initializes the root of this tree.
        this.root = root;

        // Updates the size of the tree (i.e., the number of nodes in the tree).
        if (root === undefined) {
            this.size = 0;
        } else {
            this.size = 1;
        }
    }

    /**
     * Finds all the nodes in this tree whose intervals
     * overlap with the interval of the input node.
     *
     * @param Object The input node.
     * @returns {Array} An array of nodes who's intervals are the common
     * overlaps of the this tree's intervals with the input node's interval.
     */
    overlapSearch(node) {
        // Check if the input data is valid.
        if (!node instanceof Node) {
            throw new Error("Unexpected non-node argument: " + node);
        }

        // The array to be returned that stores the nodes with common overlapping intervals.
        let result = [];

        // Return an empty array if this tree is empty or if the input node's interval
        // does not overlap with any nodes in this tree
        // (by checking the starting value of the interval is > the max value in the tree).
        if (this.root === undefined || node.low > this.root.max) {
            return result;
        }

        // Traverse all nodes in the tree in in-level order using a queue.
        let queue = [];

        // Add the root of this tree to the empty queue.
        queue.push(this.root);

        while (queue.length !== 0) {
            // Extract the current first node in the queue.
            let current = queue.shift();

            if (current !== undefined) {
                // Check if the input node's interval overlaps with current node's interval.
                if (current.hasOverlap(node)) {
                    // If they overlap, create a new node with the corresponding interval
                    // as the common overlapping interval.
                    let newnode = new Node(Math.max(current.low, node.low),
                        Math.min(current.high, node.high));

                    // Add the new node to the result array to be returned.
                    result.push(newnode);
                }
                // Add the descendant nodes of the current node to the queue.
                if(current.left !== undefined && current.left.max >= node.low) {
                    queue.push(current.left);
                }
                if(current.right !== undefined && current.right.max >= node.low) {
                    queue.push(current.right);
                }
            }
        }
        return result;
    }


    /**
     * Performs a right rotation on the node `node`.
     *      node              x
     *      / \              / \
     *     x  B      ->     A  node
     *    / \                  / \
     *   A  y                 y  B
     *
     * @param node The node to perform right rotation on.
     * @returns {*} The new root after the performed rotation.
     */
    rotateRight(node) {
        // Check if the input data is valid.
        if (!node instanceof Node) {
            throw new Error("Unexpected non-node argument: " + node);
        }
        let x = node.left;
        let y = x.right;

        // Perform the rotation.
        x.right = node;
        node.left = y;

        // Update the heights.
        node.updateHeight();
        x.updateHeight();

        // Return the new root.
        return x;
    }

    /**
     * Performs a left rotation on the node `node`.
     *      node                 y
     *      / \                 / \
     *     A  y       ->     node B
     *       / \             / \
     *      x  B            A  x
     *
     * @param node The node to perform left rotation on.
     * @returns {*} The new root after the performed rotation.
     */
    rotateLeft(node) {
        // Check if the input data is valid.
        if (!node instanceof Node) {
            throw new Error("Unexpected non-node argument: " + node);
        }
        let y = node.right;
        let x = y.left;

        // Perform the rotation.
        y.left = node;
        node.right = x;

        // Update the heights.
        node.updateHeight();
        y.updateHeight();

        // Return the new root.
        return y;
    }

    /**
     * Checks if inserting the new node 'newnode', causes the subtree rooted in 'root' to be unbalanced
     * (balance factor of the root is > 1 or < -1). In case of unbalanced tree, a rebalancing using left/right
     * rotations is performed and new new root is returned.
     *
     * @param newnode The node to be inserted.
     * @param root The current node that is examined.
     * @returns {*} The new root of the tree after the performed rotation.
     */
    balanceTree(newnode, root) {
        // Check if the input data is valid.
        if (!newnode instanceof Node || !root instanceof Node) {
            throw new Error("Unexpected non-node argument");
        }

        // For an empty tree, no rotations are performed.
        if (root === undefined) {
            return root;
        }

        // Update the root and the balance factor after inserting `newnode` in the tree rooted in `root`.
        root.updateHeight();
        let balance = root.getBalance();

        // If the root has balance factor 0, 1 or -1, then the tree is already balanced.
        if (Math.abs(balance) <= 1) {
            return root;
        }

        // Otherwise, perform a rotation depending on the following cases.
        // Left Left Case.
        if (balance > 1 && newnode.low < root.left.low) {
            root = this.rotateRight(root);
            return root;
        }

        // Right Right Case.
        if (balance < -1 && newnode.low > root.right.low) {
            return this.rotateLeft(root);
        }

        // Left Right Case.
        if (balance > 1 && newnode.low > root.left.low) {
            root.left = this.rotateLeft(root.left);
            return this.rotateRight(root);
        }

        // Right Left Case.
        if (balance < -1 && newnode.low < root.right.low) {
            root.right = this.rotateRight(root.right);
            return this.rotateLeft(root);
        }

        return root;
    }

    /**
     * Inserts a node in this tree by calling the recursive method `insertRec`.
     *
     * @param newnode The node to be inserted.
     */
    insert(newnode) {
        // Check if the input data is valid.
        if (!newnode instanceof Node) {
            throw new Error("Unexpected non-node argument: " + newnode);
        }

        // Call the recursive method `insertRec` that inserts `newnode` in this tree.
        this.root = this.insertRec(newnode, this.root);

        // Update the max value of the root node (if necessary).
        if (newnode.max > this.root.max) {
            this.root.updateMax();
        }

        // Increase the size of the tree (by one more node).
        this.size++;
    }

    /**
     * Recursive method to insert a node in the tree rooted in `root`
     * while keeping the tree balanced.
     *
     * @param newnode The node to be inserted.
     * @param root The root of the tree.
     */
    insertRec(newnode, root) {
        // Check if the input data is valid.
        if (!newnode instanceof Node || !root instanceof Node) {
            throw new Error("Unexpected non-node argument");
        }

        // If the tree is empty return the new root as the newly inserted node.
        if (root === undefined) {
            return newnode;
        }

        // Insert the node in the left or right subtree.
        if (newnode.low < root.low) {
            root.left = this.insertRec(newnode, root.left);
        } else {
            root.right = this.insertRec(newnode, root.right);
        }

        // Return the new root after rebalancing the tree.
        return this.balanceTree(newnode, root);
    }

    /**
     * Recursively collects the intervals of the node in the tree in order traversal
     * and stores them in an array that is returned.
     * This method is needed for testing when checking if two trees are equivalent, i.e.
     * contain the same intervals.
     *
     * @param result The array storing all the border values all nodes' intervals of
     *               the tree rooted in `root`..
     * @param root The root of the tree to collect intervals from.
     */
    collectInOrder(result, root) {
        // Check if the input data is valid.
        if (!result instanceof Array) {
            throw new Error("Unexpected non-array: " + result);
        }
        // Check if the input data is valid.
        if (!root instanceof Node) {
            throw new Error("Unexpected non-node: " + root);
        }

        // Collect recursively the values of the intervals of nodes.
        if (root.left !== undefined) {
            this.collectInOrder(result, root.left);
        }
        result.push(root.low);
        result.push(root.high);
        if (root.right !== undefined) {
            this.collectInOrder(result, root.right);
        }
    }

    /**
     * Creates an array containing the values of all intervals of nodes of this tree
     * in-order traversal, by calling the recursive method `collectInOrder`.
     *
     * @returns {Array} The array containing all the intervals' values of this tree.
     */
    collectIntervals() {
        // Initialize the returning array.
        let result = [];

        // Return empty array if the tree is empty.
        if (this.root === undefined) {
            return result;
        }

        // Construct the array by calling the recursive method `collectInOrder`.
        this.collectInOrder(result, this.root);
        return result;
    }

    /**
     * Calls recursive function `inorder` to print the tree in-order traversal.
     */
    printInOrder() {
        console.log("Interval tree (in-order order):");

        if (this.root === undefined) {
            console.log("null");
            return;
        }
        return this.root.inorder();
    }

    /**
     * Prints the tree in-level order using a queue.
     */
    printLevelOrder() {
        console.log("Interval tree (in-level traversal):");
        let queue = [];
        queue.push(this.root);

        while (queue.length !== 0) {
            let current = queue.shift();

            if (current === undefined) {
                console.log("null");
            } else {
                console.log(current.toString());
                queue.push(current.left);
                queue.push(current.right);
            }
        }
    }
}

module.exports = IntervalTree;
