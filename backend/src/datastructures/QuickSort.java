package datastructures;

import models.Reservation;
import java.util.List;

/**
 * Component 02: QuickSort algorithm for sorting reservations.
 * Sorts by check-in date (lexical order — dates stored as YYYY-MM-DD).
 */
public class QuickSort {

    /** Sorts reservations in-place by check-in date ascending. */
    public static void sortByCheckInDate(List<Reservation> reservations) {
        if (reservations == null || reservations.size() < 2) return;
        quickSort(reservations, 0, reservations.size() - 1);
    }

    private static void quickSort(List<Reservation> list, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(list, low, high);
            quickSort(list, low, pivotIndex - 1);
            quickSort(list, pivotIndex + 1, high);
        }
    }

    private static int partition(List<Reservation> list, int low, int high) {
        String pivot = list.get(high).getCheckInDate();
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (list.get(j).getCheckInDate().compareTo(pivot) <= 0) {
                i++;
                swap(list, i, j);
            }
        }
        swap(list, i + 1, high);
        return i + 1;
    }

    private static void swap(List<Reservation> list, int i, int j) {
        Reservation temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }
}
