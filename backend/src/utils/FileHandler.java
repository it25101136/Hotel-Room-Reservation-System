package utils;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Centralised file handling utility for all .txt persistence files.
 * All data files live in backend/data/
 */
public class FileHandler {

    private static final String DATA_DIR = "backend/data/";

    static {
        // Make sure the data directory exists at startup
        File dir = new File(DATA_DIR);
        if (!dir.exists()) dir.mkdirs();
    }

    /** Read all lines from a file. Returns empty list if file does not exist. */
    public static List<String> readAllLines(String fileName) {
        List<String> lines = new ArrayList<>();
        File file = new File(DATA_DIR + fileName);
        if (!file.exists()) return lines;

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) lines.add(line);
            }
        } catch (IOException e) {
            System.err.println("[FileHandler] Error reading " + fileName + ": " + e.getMessage());
        }
        return lines;
    }

    /** Append a single line to a file. */
    public static void appendLine(String fileName, String line) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(DATA_DIR + fileName, true))) {
            writer.write(line);
            writer.newLine();
        } catch (IOException e) {
            System.err.println("[FileHandler] Error writing to " + fileName + ": " + e.getMessage());
        }
    }

    /** Overwrite the file with the given lines. */
    public static void writeAllLines(String fileName, List<String> lines) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(DATA_DIR + fileName, false))) {
            for (String line : lines) {
                writer.write(line);
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("[FileHandler] Error overwriting " + fileName + ": " + e.getMessage());
        }
    }

    public static boolean fileExists(String fileName) {
        return new File(DATA_DIR + fileName).exists();
    }
}
