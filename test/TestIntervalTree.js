/**
 Copyright Daniela Maftuleac 2019.
 */

let assert = require('assert')
let Node = require('../src/Node.js')
let IntervalTree = require('../src/IntervalTree.js');

/**
 * Tests for 1 single node interval tree.
 */
describe('1NodeIntervalTree', function () {
    describe('1Node', function () {
        it('hierarchy', function () {
            let low = Math.floor(Math.random() * 100);
            let high = Math.floor(Math.random() * 100);
            let node = new Node(low, high);
            let tree = new IntervalTree(node);
            assert.equal(tree.root, node);
        });
    });
});

/**
 * Tests for node interval tree with 2 nodes.
 */
describe('2NodesIntervalTree', function () {
    /**
     * Tests for interval tree with 2 equivalent nodes.
     */
    describe('2 equivalent nodes', function () {
        it('insertion', function () {
            let low = Math.floor(Math.random() * 100);
            let high = Math.floor(Math.random() * 100);
            let leaf = new Node(low, high);
            let root = new Node(low, high);
            let tree = new IntervalTree(root);
            tree.insert(leaf);
            assert.equal(tree.root, root);
            assert.equal(root.right, leaf);
            assert.equal(tree.size, 2);
        });
    });

    /**
     * Tests for interval tree with 2 different nodes.
     */
    describe('2 distinct nodes', function () {
        it('insertion', function () {
            let tree = new IntervalTree();
            tree.insert(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            tree.insert(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            assert.equal(tree.size, 2);
            assert.equal(Math.abs(tree.root.getBalance()), Math.abs(1));

        });
    });
});

/**
 * Tests for node interval tree with 3 nodes.
 */
describe('3NodesIntervalTree', function () {
    /**
     * Tests the balance factor of the root node.
     */
    describe('hierarchy', function () {
        it('balance factor is 0,1 or -1', function () {
            let tree = new IntervalTree();
            tree.insert(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            tree.insert(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            tree.insert(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            assert.equal(tree.size, 3);
            assert(Math.abs(tree.root.getBalance()) <= 1);
            assert(tree.root.left !== undefined);
            assert(tree.root.right !== undefined);
        });
    });
});

/**
 * Tests for node interval tree with 10 nodes.
 */
describe('10NodesIntervalTree', function () {
    /**
     * Tests the balance factor of the root node.
     */
    describe('hierarchy', function () {
        it('balance factor is 0,1 or -1', function () {
            let tree = new IntervalTree();
            for (let i = 0; i < 10; i++) {
                tree.insert(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            }
            assert.equal(tree.size, 10);
            console.log(tree.root.getBalance());
            assert(Math.abs(tree.root.getBalance()) <= 1);
            assert(tree.root.left !== undefined);
            assert(tree.root.right !== undefined);
        });
    });
});

/**
 * Tests for node interval tree with 11 nodes.
 */
describe('11NodesIntervalTree', function () {
    /**
     * Tests the balance factor of the root node.
     */
    describe('hierarchy', function () {
        it('balance factor is 0,1 or -1', function () {
            let tree = new IntervalTree();
            for (let i = 0; i < 11; i++) {
                tree.insert(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            }
            assert.equal(tree.size, 11);
            assert(Math.abs(tree.root.getBalance()) <= 1);
            assert(tree.root.left !== undefined);
            assert(tree.root.right !== undefined);
        });
    });
});

/**
 * Tests for node interval tree with 20 nodes.
 */
describe('20NodesIntervalTree', function () {
    /**
     * Tests the balance factor of the root node.
     */
    describe('hierarchy', function () {
        it('balance factor is 0,1 or -1', function () {
            let tree = new IntervalTree(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            for (let i = 0; i < 20; i++) {
                let node = new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
                let overlap = tree.overlapSearch(node);
                if (overlap.length === 0) {
                    tree.insert(node);
                }
            }
            assert(Math.abs(tree.root.getBalance()) <= 1);
            assert(tree.size > 0);
        });
    });
});

/**
 * Tests for node interval tree with 50 nodes.
 */
describe('50NodesIntervalTree', function () {
    /**
     * Tests the balance factor of the root node.
     */
    describe('hierarchy', function () {
        it('balance factor is 0,1 or -1', function () {
            let tree = new IntervalTree(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            for (let i = 0; i < 50; i++) {
                let node = new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
                let overlap = tree.overlapSearch(node);
                if (overlap.length === 0) {
                    tree.insert(node);
                }
            }
            assert(tree.size > 0);
            assert(Math.abs(tree.root.getBalance()) <= 1);
        });
    });
});

/**
 * Tests for node interval tree with 100 nodes.
 */
describe('100NodesIntervalTree', function () {
    /**
     * Tests the balance factor of the root node.
     */
    describe('hierarchy', function () {
        it('balance factor is 0,1 or -1', function () {
            let tree = new IntervalTree(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            for (let i = 0; i < 100; i++) {
                let node = new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
                let overlap = tree.overlapSearch(node);
                if (overlap.length === 0) {
                    tree.insert(node);
                }
            }
            assert(Math.abs(tree.root.getBalance()) <= 1);
        });
    });
});