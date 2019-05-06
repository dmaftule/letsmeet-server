/**
 Copyright Daniela Maftuleac 2019.
 */

let assert = require('assert')
let Node = require('../src/Node.js')
let IntervalTree = require('../src/IntervalTree.js');
let Algo = require('../src/IntervalUtils.js');

/**
 * Tests for overlapping search of an interval and an interval tree.
 */
describe('Interval overlap search', function () {
    /**
     * Tests for overlapping search of an non-empty interval and an empty interval tree.
     */
    describe('An empty tree and an interval', function () {
        it('Empty solution expected', function () {
            let node = new Node(Math.random(), Math.random());
            let tree = new IntervalTree();
            let overlap = tree.overlapSearch(node);
            assert.equal(overlap.length, 0);
        });
    });

    /**
     * Tests for overlapping search of an interval and an interval tree
     * with 3 nodes. The interval has it's low value greater than the max of the root node,
     * which means there are no common overlaps.
     */
    describe('Interval tree of size 3 and an interval outside the range', function () {
        it('Empty solution expected', function () {
            let treenode1 = new Node(Math.random(), Math.random());
            let treenode2 = new Node(Math.random(), Math.random());
            let treenode3 = new Node(Math.random(), Math.random());
            let max = Math.max(treenode1.max, treenode2.max, treenode3.max);
            let node = new Node(max + 1, max + 2);
            let tree = new IntervalTree();
            tree.insert(treenode1);
            tree.insert(treenode2);
            tree.insert(treenode3);
            let overlap = tree.overlapSearch(node);
            assert.equal(overlap.length, 0);
        });
    });
});

/**
 * Tests for overlapping search of two or more interval trees.
 */
describe('Common overlap search', function () {
    /**
     * Tests for overlapping search of two empty interval trees.
     */
    describe('2 empty trees', function () {
        it('null solution expected', function () {
            let trees = [];

            let tree1 = new IntervalTree();
            assert(Algo.isTree(tree1));

            let tree2 = new IntervalTree();
            assert(Algo.isTree(tree2));

            trees.push(tree1);
            trees.push(tree2);
            let solution = Algo.findSolution(trees);
            assert(Algo.isTree(solution));
            assert.equal(solution.size, 0);
        });
    });

    /**
     * Tests for overlapping search of two identical interval trees.
     */
    describe('2 identical trees', function () {
        it('solution is expected to be the same tree', function () {
            let trees = [];
            let tree1 = new IntervalTree();
            let treenode1 = new Node(Math.random(), Math.random());
            let treenode2 = new Node(Math.random(), Math.random());
            let treenode3 = new Node(Math.random(), Math.random());
            tree1.insertRec(treenode1);
            tree1.insertRec(treenode2);
            tree1.insertRec(treenode3);
            assert(Algo.isTree(tree1));

            let tree2 = new IntervalTree();
            tree2.insertRec(treenode1);
            tree2.insertRec(treenode2);
            tree2.insertRec(treenode3);
            trees.push(tree1);
            trees.push(tree2);
            assert(Algo.isTree(tree2));

            let solution = Algo.findSolution(trees);
            assert(Algo.isTree(solution));

            assert(Algo.equivalentTrees(tree1, tree2));
            assert(Algo.equivalentTrees(solution, tree1));
        });
    });

    /**
     * Tests for overlapping search of three non-empty interval trees.
     */
    describe('3 non-empty trees', function () {
        it('expected tree with [1,2],[3,4],[6,7]', function () {
            let trees = [];
            trees[0] = new IntervalTree();
            trees[0].insert(new Node(0, 2));
            trees[0].insert(new Node(3, 7));
            trees[0].insert(new Node(9, 11));
            trees[0].insert(new Node(13, 15));
            assert(Algo.isTree(trees[0]));

            trees[1] = new IntervalTree();
            trees[1].insert(new Node(1, 5));
            trees[1].insert(new Node(6, 10));
            trees[1].insert(new Node(12, 13));
            trees[1].insert(new Node(16, 17));
            assert(Algo.isTree(trees[1]));

            trees[2] = new IntervalTree();
            trees[2].insert(new Node(0, 4));
            trees[2].insert(new Node(6, 8));
            trees[2].insert(new Node(11, 11));
            trees[2].insert(new Node(14, 17));
            assert(Algo.isTree(trees[2]));

            let solution = Algo.findSolution(trees);
            assert(Algo.isTree(solution));

            let expectedTree = new IntervalTree(new Node(1, 2));
            expectedTree.insert(new Node(3, 4));
            expectedTree.insert(new Node(6, 7));
            assert(Algo.isTree(expectedTree));

            assert(Algo.equivalentTrees(solution, expectedTree));
        });
    });

    /**
     * Tests for overlapping search of three interval trees.
     * User 1: [0, 2], [3, 7], [9,11], [13,15]
     * User 2: [1, 5], [12, 13], [16,17]
     * User 3: [0, 4]
     * Common overlaps: [1,2], [3,4]
     */
    describe('3 trees with different number of intervals', function () {
        it('expected tree with [1,2], [3,4]', function () {
            let trees = [];
            trees[0] = new IntervalTree();
            trees[0].insert(new Node(0, 2));
            trees[0].insert(new Node(3, 7));
            trees[0].insert(new Node(9, 11));
            trees[0].insert(new Node(13, 15));
            assert(Algo.isTree(trees[0]));

            trees[1] = new IntervalTree();
            trees[1].insert(new Node(1, 5));
            trees[1].insert(new Node(12, 13));
            trees[1].insert(new Node(16, 17));
            assert(Algo.isTree(trees[1]));

            trees[2] = new IntervalTree();
            trees[2].insert(new Node(0, 4));

            console.log("Trees:");
            trees[0].printLevelOrder();
            trees[1].printLevelOrder();
            trees[2].printLevelOrder();

            let solution = Algo.findSolution(trees);
            assert(Algo.isTree(solution));

            console.log("Solution:");
            solution.printLevelOrder();

            let expectedTree = new IntervalTree(new Node(1, 2));
            expectedTree.insert(new Node(3, 4));
            assert(Algo.isTree(expectedTree));
            console.log("Expected:");
            expectedTree.printLevelOrder();

            assert(Algo.equivalentTrees(solution, expectedTree));
        });
    });

    /**
     * Tests for overlapping search of three interval trees with no overlaps.
     * User 1: [0, 2], [3, 7], [9,11], [13,15]
     * User 2: [6, 8], [11, 12], [16,17]
     * User 3: [18, 20]
     * Common overlaps: no overlaps
     */
    describe('3 non-empty trees with no overlaps', function () {
        it('expected tree is null', function () {
            let trees = [];
            trees[0] = new IntervalTree();
            trees[0].insert(new Node(0, 2));
            trees[0].insert(new Node(3, 5));
            trees[0].insert(new Node(9, 10));
            trees[0].insert(new Node(13, 15));
            assert(Algo.isTree(trees[0]));

            trees[1] = new IntervalTree();
            trees[1].insert(new Node(6, 8));
            trees[1].insert(new Node(11, 12));
            trees[1].insert(new Node(16, 17));
            assert(Algo.isTree(trees[1]));

            trees[2] = new IntervalTree();
            trees[2].insert(new Node(18, 20));
            assert(Algo.isTree(trees[2]));

            let solution = Algo.findSolution(trees);
            assert(Algo.isTree(solution));

            assert.equal(solution.size, 0);
        });
    });
});

/**
 * Tests for overlapping search of 2 interval trees with 50 random intervals each.
 * Checking the balance factor and that the solution tree has at least one node.
 * The second assertion could be wrong.
 */
describe('2IntervalTrees', function () {
    describe('50 nodes each', function () {
        it('some solution expected', function () {
            let trees = [];
            trees[0] = new IntervalTree();
            trees[1] = new IntervalTree();
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 50; j++) {
                    let node = new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
                    let overlap = trees[i].overlapSearch(node);
                    if (overlap.length === 0) {
                        trees[i].insert(node);
                    }
                }
            }
            assert(Math.abs(trees[0].root.getBalance()) <= 1);
            assert(Math.abs(trees[1].root.getBalance()) <= 1);

            let solution = Algo.findSolution(trees);
            assert(Algo.isTree(solution));
            assert(solution.size > 1); //purely guessing
        });
    });
});

/**
 * Tests for overlapping search of k interval trees (k < 10) with random number of intervals each.
 * Note that the more interval trees participate to finding common overlaps, the less chances
 * of at existence of overlaps.
 * Checking the balance factor and that the solution tree is an interval tree.
 */
describe('kIntervalTrees', function () {
    describe('random nodes each 1', function () {
        it('some solution expected', function () {
            // Number of trees is chosen randomly between 0 and 10.
            let k = Math.floor(Math.random() * 10);

            // Initializing the array of interval trees.
            let trees = [];

            let i;
            // Initializing the k trees.
            for (i = 0; i < k; i++) {
                trees[i] = new IntervalTree(new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)));
            }

            // Inserting nodes with random intervals in each tree. The number of nodes of each tree is random as well.
            for (i = 0; i < k; i++) {
                let nodeNumber = Math.floor(Math.random() * 100);
                for (let j = 0; j < nodeNumber; j++) {
                    let node = new Node(Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
                    let overlap = trees[i].overlapSearch(node);
                    if (overlap.length === 0) {
                        trees[i].insert(node);
                    }
                }
            }

            // Find the interval tree that contains node with common intervals from all k given interval trees.
            let solution = Algo.findSolution(trees);
            // Assert that the solution is an interval tree.
            assert(Algo.isTree(solution));
        });
    });
});