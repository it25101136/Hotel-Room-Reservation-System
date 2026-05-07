package datastructures;

import models.Room;
import java.util.ArrayList;
import java.util.List;

/**
 * Component 01: Binary Search Tree for Room Management
 * - Efficient insertion: O(log n) average
 * - Efficient deletion: O(log n) average
 * - Fast searching by room number: O(log n) average
 */
public class BinarySearchTree {

    private static class Node {
        Room room;
        Node left, right;

        Node(Room room) {
            this.room = room;
        }
    }

    private Node root;
    private int size = 0;

    public int size() { return size; }

    /** Insert a room into the BST based on room number */
    public void insert(Room room) {
        root = insertRecursive(root, room);
    }

    private Node insertRecursive(Node node, Room room) {
        if (node == null) {
            size++;
            return new Node(room);
        }
        if (room.getRoomNumber() < node.room.getRoomNumber()) {
            node.left = insertRecursive(node.left, room);
        } else if (room.getRoomNumber() > node.room.getRoomNumber()) {
            node.right = insertRecursive(node.right, room);
        } else {
            // Update existing room
            node.room = room;
        }
        return node;
    }

    /** Search for a room by number */
    public Room search(int roomNumber) {
        return searchRecursive(root, roomNumber);
    }

    private Room searchRecursive(Node node, int roomNumber) {
        if (node == null) return null;
        if (roomNumber == node.room.getRoomNumber()) return node.room;
        if (roomNumber < node.room.getRoomNumber())
            return searchRecursive(node.left, roomNumber);
        return searchRecursive(node.right, roomNumber);
    }

    /** Delete a room by number */
    public boolean delete(int roomNumber) {
        int oldSize = size;
        root = deleteRecursive(root, roomNumber);
        return size < oldSize;
    }

    private Node deleteRecursive(Node node, int roomNumber) {
        if (node == null) return null;
        if (roomNumber < node.room.getRoomNumber()) {
            node.left = deleteRecursive(node.left, roomNumber);
        } else if (roomNumber > node.room.getRoomNumber()) {
            node.right = deleteRecursive(node.right, roomNumber);
        } else {
            size--;
            // Node with only one child or no child
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;
            // Two children: get inorder successor (smallest in right subtree)
            node.room = findMin(node.right).room;
            size++; // compensate (we'll decrement again)
            node.right = deleteRecursive(node.right, node.room.getRoomNumber());
        }
        return node;
    }

    private Node findMin(Node node) {
        while (node.left != null) node = node.left;
        return node;
    }

    /** Get all rooms via in-order traversal (sorted by room number) */
    public List<Room> getAllRooms() {
        List<Room> rooms = new ArrayList<>();
        inOrderTraversal(root, rooms);
        return rooms;
    }

    private void inOrderTraversal(Node node, List<Room> rooms) {
        if (node == null) return;
        inOrderTraversal(node.left, rooms);
        rooms.add(node.room);
        inOrderTraversal(node.right, rooms);
    }

    public void clear() {
        root = null;
        size = 0;
    }
}
