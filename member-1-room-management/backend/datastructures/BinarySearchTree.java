package datastructures;

import models.Room;
import java.util.ArrayList;
import java.util.List;

/**
 * Binary Search Tree for Room Management.
 * - insert / search / delete: O(log n) average
 *
 * Author: Member 1
 */
public class BinarySearchTree {

    private static class Node {
        Room room; // Aggregation (Room exists independentl
        Node left, right; // Self-referencing structure
        Node(Room room) { this.room = room; }
    }

    private Node root;
    private int size = 0;

    public int size() { return size; }

    public void insert(Room room) { root = insertRecursive(root, room); }

    private Node insertRecursive(Node node, Room room) {
        if (node == null) { size++; return new Node(room); }
        if (room.getRoomNumber() < node.room.getRoomNumber())
            node.left = insertRecursive(node.left, room);
        else if (room.getRoomNumber() > node.room.getRoomNumber())
            node.right = insertRecursive(node.right, room);
        else
            node.room = room; // update existing
        return node;
    }

    public Room search(int roomNumber) { return searchRec(root, roomNumber); }

    private Room searchRec(Node node, int n) {
        if (node == null) return null;
        if (n == node.room.getRoomNumber()) return node.room;
        return n < node.room.getRoomNumber()
                ? searchRec(node.left, n)
                : searchRec(node.right, n);
    }

    public boolean delete(int roomNumber) {
        int oldSize = size;
        root = deleteRec(root, roomNumber);
        return size < oldSize;
    }

    private Node deleteRec(Node node, int n) {
        if (node == null) return null;
        if (n < node.room.getRoomNumber()) node.left = deleteRec(node.left, n);
        else if (n > node.room.getRoomNumber()) node.right = deleteRec(node.right, n);
        else {
            size--;
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;
            node.room = findMin(node.right).room;
            size++;
            node.right = deleteRec(node.right, node.room.getRoomNumber());
        }
        return node;
    }

    private Node findMin(Node node) {
        while (node.left != null) node = node.left;
        return node;
    }

    public List<Room> getAllRooms() {
        List<Room> rooms = new ArrayList<>();
        inOrder(root, rooms);
        return rooms;
    }

    private void inOrder(Node node, List<Room> rooms) {
        if (node == null) return;
        inOrder(node.left, rooms);
        rooms.add(node.room);
        inOrder(node.right, rooms);
    }
}
