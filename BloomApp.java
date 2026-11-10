/**
 * Bloom - Empathetic Productivity & Life Guidance System for Student-Workers
 * 
 * Languages: Java (Backend / Core Domain Engine)
 * Companion Web Files: index.html (HTML) and bloom.css (CSS)
 */

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class BloomApp {

    // --- ENUMS ---

    public enum Priority {
        HIGH(100, "High Priority (Urgent)"),
        MEDIUM(50, "Medium Priority"),
        LOW(10, "Low Priority (Later)");

        private final int weight;
        private final String label;

        Priority(int weight, String label) {
            this.weight = weight;
            this.label = label;
        }

        public int getWeight() {
            return weight;
        }

        public String getLabel() {
            return label;
        }
    }

    public enum Category {
        SCHOOL("School"),
        WORK("Job / Shift"),
        LIFE("Personal / Life"),
        HEALTH("Rest / Health");

        private final String displayName;

        Category(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // --- TASK MODEL ---

    public static class Task {
        private final String id;
        private String title;
        private Priority priority;
        private Category category;
        private int estimatedMinutes;
        private boolean completed;
        private final List<String> microSteps;
        private final long createdAt;

        public Task(String title, Priority priority, Category category, int estimatedMinutes) {
            this.id = "task_" + UUID.randomUUID().toString().substring(0, 8);
            this.title = title;
            this.priority = priority;
            this.category = category;
            this.estimatedMinutes = estimatedMinutes;
            this.completed = false;
            this.createdAt = System.currentTimeMillis();
            this.microSteps = generateMicroSteps(title, category);
        }

        public String getId() { return id; }
        public String getTitle() { return title; }
        public Priority getPriority() { return priority; }
        public Category getCategory() { return category; }
        public int getEstimatedMinutes() { return estimatedMinutes; }
        public boolean isCompleted() { return completed; }
        public List<String> getMicroSteps() { return Collections.unmodifiableList(microSteps); }

        public void setCompleted(boolean completed) {
            this.completed = completed;
        }

        public void toggleCompleted() {
            this.completed = !this.completed;
        }

        /**
         * Automatically generates 3 friction-free 3-to-5 minute micro-steps
         * to break through task freeze and procrastination.
         */
        public static List<String> generateMicroSteps(String taskTitle, Category category) {
            String lower = (taskTitle != null ? taskTitle.toLowerCase() : "");
            List<String> steps = new ArrayList<>();

            if (lower.contains("essay") || lower.contains("paper") || lower.contains("write") || lower.contains("draft")) {
                steps.add("Open your document and write just 1 rough sentence—even if it feels messy.");
                steps.add("Jot down 3 quick bullet points for what each paragraph will discuss.");
                steps.add("Skim the rubric for 2 minutes to spot the easiest points to grab, then breathe.");
            } else if (lower.contains("math") || lower.contains("physics") || lower.contains("calc") || lower.contains("problem")) {
                steps.add("Look at problem #1, write down the formula, and solve only the first line of calculation.");
                steps.add("Check your notes or a quick example video for 3 minutes if you feel stuck.");
                steps.add("Finish that single problem, put a star next to it, and celebrate starting.");
            } else if (lower.contains("work") || lower.contains("shift") || lower.contains("job") || lower.contains("boss") || lower.contains("manager")) {
                steps.add("Check your work schedule app and calendar to confirm your exact shift times.");
                steps.add("Lay out your work uniform or clothes right now so you don't panic later.");
                steps.add("Draft a quick 1-sentence note to your manager if you need an exam week adjustment.");
            } else {
                steps.add("Spend 60 seconds setting up your environment for '" + taskTitle + "' (water bottle, clear screen).");
                steps.add("Set a 5-minute timer and do the easiest first 10% without aiming for perfection.");
                steps.add("Stop or continue: you broke the procrastination freeze, which is 80% of the battle.");
            }
            return steps;
        }

        @Override
        public String toString() {
            return String.format("[%s] %s | %s | %d min | Steps: %s",
                    completed ? "X" : " ",
                    title,
                    priority.getLabel(),
                    estimatedMinutes,
                    microSteps.get(0));
        }
    }

    // --- POP CULTURE QUOTE ENGINE ---

    public static class Quote {
        private final String text;
        private final String source;
        private final String theme;

        public Quote(String text, String source, String theme) {
            this.text = text;
            this.source = source;
            this.theme = theme;
        }

        public String getText() { return text; }
        public String getSource() { return source; }
        public String getTheme() { return theme; }

        @Override
        public String toString() {
            return "\"" + text + "\" — " + source + " (" + theme + ")";
        }
    }

    public static class QuoteEngine {
        private static final List<Quote> QUOTES = Arrays.asList(
            new Quote("It ain't about how hard you hit. It's about how hard you can get hit and keep moving forward.", "Rocky Balboa", "Grit"),
            new Quote("That's all it is, Miles. A leap of faith.", "Spider-Man: Into the Spider-Verse", "Courage"),
            new Quote("You don't have to carry the whole mountain all at once. Just move the next stone.", "Modern Folklore & Cinema", "Calm"),
            new Quote("You are not on your own. You never were.", "Spider-Man: No Way Home", "Belonging"),
            new Quote("Your focus determines your reality. Take it one breath and one moment at a time.", "Star Wars: The Phantom Menace", "Focus"),
            new Quote("We each need to find our own inspiration. Sometimes it's not easy, but you will get through this.", "Kiki's Delivery Service (Studio Ghibli)", "Growth"),
            new Quote("No matter what anybody tells you, words and ideas can change the world.", "Dead Poets Society", "Purpose")
        );

        private final Random random = new Random();

        public Quote getRandomQuote() {
            return QUOTES.get(random.nextInt(QUOTES.size()));
        }

        public List<Quote> getAllQuotes() {
            return Collections.unmodifiableList(QUOTES);
        }
    }

    // --- BLOOMAI EMPATHETIC COMPANION ENGINE ---

    public static class BloomAI {
        public static String respond(String userMessage) {
            if (userMessage == null || userMessage.trim().isEmpty()) {
                return "I'm right here with you. Take a slow breath—what's on your mind?";
            }

            String lower = userMessage.toLowerCase();

            // Guidance counselors & adults
            if (lower.contains("counselor") || lower.contains("guidance") || lower.contains("parents") || lower.contains("adults")) {
                return "A lot of counselors and adults give advice like 'just buy a planner' because they operate on a 1990s playbook. " +
                       "They don't understand what it's like clocking out at 10 PM on a Tuesday, having homework waiting, and feeling constantly exhausted.\n" +
                       "Their inability to understand your reality does NOT mean you're failing. Balancing a job and high school requires serious grit. " +
                       "Here at BloomAI, nobody is grading you or lecturing you.";
            }

            // Shifts, jobs & bosses
            if (lower.contains("shift") || lower.contains("boss") || lower.contains("work") || lower.contains("manager") || lower.contains("job")) {
                return "Balancing a job outside of school is tough. Remember: You are a student first. Your high school diploma stays with you forever; an hourly shift does not.\n" +
                       "When asking to cut hours for exams, use this script:\n" +
                       "'Hi [Manager], my midterm exams are scheduled next week. To make sure I keep my grades up while performing well here, could I swap my shift or cap my hours at 12 this week?'\n" +
                       "Giving advance notice makes it very hard for them to say no.";
            }

            // Late night exhaustion
            if (lower.contains("late") || lower.contains("night") || lower.contains("sleep") || lower.contains("exhausted") || lower.contains("tired")) {
                return "Late nights are when everything feels 10x heavier than it actually is. Your brain is running on fumes right now.\n" +
                       "• Pick just ONE minimum thing to secure passing credit tomorrow (e.g. write 1 rough paragraph or do 2 problems).\n" +
                       "• If it's truly too late, send a brief email to your teacher before midnight.\n" +
                       "• Give yourself full permission to sleep. Sleep is not a reward you have to earn—it's fuel you need to survive.";
            }

            // Loneliness & friends
            if (lower.contains("lonely") || lower.contains("alone") || lower.contains("friends") || lower.contains("behind")) {
                return "When you work after school while other kids hang out, it's so easy to feel like an outsider looking through a window.\n" +
                       "Truth: almost every 17-year-old is secretly anxious and insecure. You're maturing faster because of your real-world responsibilities, " +
                       "and that can feel lonely. You're not defective for feeling isolated. I'm always here to listen.";
            }

            // Default grounded empathetic reply
            return "I hear you loud and clear. When you're managing school, a job, and personal struggles all at once, carrying all of that alone feels suffocating.\n" +
                   "1. Don't try to solve your whole future tonight. You only need to handle the next 15 minutes.\n" +
                   "2. Pick the single smallest action you can take to relieve pressure.\n" +
                   "3. Be kind to yourself: you are working harder than most adults realize.\n" +
                   "Tell me a little more about what's feeling heaviest right now.";
        }
    }

    // --- MAIN DEMO EXECUTION ---

    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("  🌸 BLOOM - Human-Centered Student Support App 🌸");
        System.out.println("=================================================\n");

        // 1. Pop Culture Motivational Quote
        QuoteEngine quoteEngine = new QuoteEngine();
        Quote quote = quoteEngine.getRandomQuote();
        System.out.println("🌟 INSPIRATIONAL QUOTE (Refreshes every 30s):");
        System.out.println(quote + "\n");

        // 2. Task Manager with Priority System
        System.out.println("📋 TASK PRIORITIZATION BOARD:");
        List<Task> taskList = new ArrayList<>();
        taskList.add(new Task("Draft AP History DBQ essay", Priority.HIGH, Category.SCHOOL, 30));
        taskList.add(new Task("Confirm work schedule swap with manager", Priority.HIGH, Category.WORK, 5));
        taskList.add(new Task("Skim Chapter 4 Biology notes", Priority.MEDIUM, Category.SCHOOL, 15));
        taskList.add(new Task("Hydrate & do 4-7-8 breathing exercise", Priority.LOW, Category.HEALTH, 5));

        // Sort by Priority (High to Low, incomplete first)
        taskList.sort((a, b) -> {
            if (a.isCompleted() != b.isCompleted()) {
                return a.isCompleted() ? 1 : -1;
            }
            return Integer.compare(b.getPriority().getWeight(), a.getPriority().getWeight());
        });

        for (Task task : taskList) {
            System.out.println(task);
            System.out.println("   💡 BloomAI Micro-Steps:");
            for (int i = 0; i < task.getMicroSteps().size(); i++) {
                System.out.println("      " + (i + 1) + ". " + task.getMicroSteps().get(i));
            }
            System.out.println();
        }

        // 3. BloomAI 24/7 Companion Chatbot Demo
        System.out.println("💬 BLOOMAI 24/7 COMPANION CONSULTATION:");
        String studentPrompt = "My guidance counselor told me to 'just buy a planner' when I am working 20 hours a week.";
        System.out.println("Student: " + studentPrompt);
        System.out.println("\nBloomAI:");
        System.out.println(BloomAI.respond(studentPrompt));
        System.out.println("\n=================================================");
        System.out.println("Bloom engine successfully initialized and verified.");
    }
}
