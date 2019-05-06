/**
 Copyright Daniela Maftuleac 2019.
 */

const express = require('express');
let assert = require('assert')
let Node = require('../src/Node.js')

/**
 * Tests for 1 single node.
 */
describe('1Node', function () {
    /**
     * Tests if a single node has the height 1.
     */
    describe('Leaf height', function () {
        it('The height of a leaf node is always 1', function () {
            let node = new Node();
            assert.equal(node.height, 1);
        });
    });

    /**
     * Tests if a single node has the max value equal to the high value of the node's interval.
     */
    describe('Leaf max value', function () {
        it('The max of a leaf node is always the high value of the node', function () {
            let low = Math.random();
            let high = Math.random();
            let node = new Node(high, low);
            assert.equal(node.max, node.high);
        });
    });
});

/**
 * Tests for 2 nodes.
 */
describe('2Nodes', function () {
    /**
     * Tests two nodes relation: parent and left child.
     */
    describe('parent - left child', function () {
        it('The left node of the parent', function () {
            let low = Math.random();
            let high = Math.random();
            let parent = new Node(high, low);
            let leaf = new Node(low, high);
            parent.left = leaf;
            assert.equal(parent.left, leaf);
            assert.equal(parent.right, undefined);
        });
    });

    /**
     * Tests the height value of parent and left child.
     */
    describe('height', function () {
        it('The height of a non-leaf node is > 1', function () {
            let low = Math.random();
            let high = Math.random();
            let parent = new Node(high, low);
            let leaf = new Node(low, high);
            parent.left = leaf;
            parent.updateHeight();
            assert.equal(parent.height, 2);
            assert.equal(leaf.height, 1);
        });
    });

    /**
     * Tests the max value of parent and left child.
     */
    describe('max', function () {
        it('The max of a non-leaf node the maximum value of the subtree', function () {
            let low = Math.ceil(Math.random() * 100);
            let high = Math.ceil(Math.random() * 100);
            let parent = new Node(low, high);
            assert.equal(parent.max, Math.max(high, low));
            let leaf = new Node(Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 100));
            parent.left = leaf;
            parent.updateHeight();
            parent.updateMax();
            assert.equal(parent.right, undefined);
            assert.equal(parent.max, Math.max(low, high, leaf.max));
            parent.updateHeight();
            parent.updateMax();
            assert.equal(parent.max, Math.max(low, high, leaf.max));
            assert.equal(leaf.max, leaf.high);
        });
    });
});

/**
 * Tests for 3 nodes, case of balanced tree.
 */
describe('3Nodes balanced', function () {
    /**
     * Tests the max value of nodes.
     */
    describe('max', function () {
        it('The max of a non-leaf node the maximum value of the subtree', function () {
            let low = Math.random();
            let parent = new Node(low, 100);
            let leftLeaf = new Node(low, 1000);
            let rightLeaf = new Node(low, 10000);
            parent.left = leftLeaf;
            parent.right = rightLeaf;
            parent.updateHeight();
            parent.updateMax();
            assert.equal(parent.max, Math.max(10000, low));
            assert.equal(leftLeaf.max, leftLeaf.high);
            assert.equal(rightLeaf.max, rightLeaf.high);
        });
    });

    /**
     * Tests the balance factor value of nodes.
     */
    describe('balance', function () {
        it('balance factor', function () {
            let low = Math.random();
            let parent = new Node(Math.random(), Math.random());
            let leftLeaf = new Node(Math.random(), Math.random());
            let rightLeaf = new Node(Math.random(), Math.random());
            parent.left = leftLeaf;
            parent.right = rightLeaf;
            parent.updateHeight();
            assert.equal(Math.abs(parent.getBalance()), Math.abs(0));
            assert.equal(leftLeaf.getBalance(), Math.abs(0));
            assert.equal(rightLeaf.getBalance(), Math.abs(0));
        });
    });
});

/**
 * Tests for 3 nodes, case of unbalanced tree.
 */
describe('3Nodes unbalanced', function () {
    describe('max', function () {
        it('max of a non-leaf node the maximum value of the subtree', function () {
            let grandparent = new Node(0, 1);
            let parent = new Node(0, 10);
            let child = new Node(0, 100);
            grandparent.right = parent;
            parent.right = child;
            grandparent.updateHeight();
            grandparent.updateMax();
            parent.updateHeight();
            parent.updateMax();
            assert.equal(grandparent.max, 100);
            assert.equal(parent.max, 100);
            assert.equal(child.max, 100);
        });
    });

    /**
     * Tests the balance factor value of nodes.
     */
    describe('balance', function () {
        it('balance factor', function () {
            let low = Math.random();
            let grandparent = new Node(Math.random(), Math.random());
            let parent = new Node(Math.random(), Math.random());
            let child = new Node(Math.random(), Math.random());
            grandparent.left = parent;
            parent.left = child;
            grandparent.updateHeight();
            assert.equal(Math.abs(grandparent.getBalance()), Math.abs(2));
            assert.equal(Math.abs(parent.getBalance()), Math.abs(1));
            assert.equal(child.getBalance(), Math.abs(0));
        });
    });
});
