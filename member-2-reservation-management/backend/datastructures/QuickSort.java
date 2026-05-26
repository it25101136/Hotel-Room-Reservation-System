package datastructures;

import models.Reservation;
import java.util.List;

/** QuickSort for reservations — sorted by check-in date ascending. Author: Member 2 */
public class QuickSort {
    public static void sortByCheckInDate(List<Reservation> reservations) {
        if (reservations == null || reservations.size() < 2) return;
        quickSort(reservations, 0, reservations.size() - 1);
    }

    private static void quickSort(List<Reservation> list, int low, int high) {
        if (low < high) {
            int pi = partition(list, low, high);
            quickSort(list, low, pi - 1);
            quickSort(list, pi + 1, high);
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
        Reservation t = list.get(i);
        list.set(i, list.get(j));
        list.set(j, t);
    }
}
