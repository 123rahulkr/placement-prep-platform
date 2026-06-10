require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const Problem = require("../models/Problem");

const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description:
      "Given an array of integers and a target, return indices of the two numbers that add up to the target.",
    difficulty: "Easy",
    topic: "Arrays",
    companies: ["Amazon", "Google", "Microsoft", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/two-sum",
    hints: [
      "Use a hash map to store complement of each number",
      "For each number check if target minus that number exists in the map",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    description:
      "Find the maximum profit from buying and selling a stock once given an array of daily prices.",
    difficulty: "Easy",
    topic: "Arrays",
    companies: ["Amazon", "Facebook", "Goldman Sachs"],
    leetcodeUrl:
      "https://leetcode.com/problems/best-time-to-buy-and-sell-stock",
    hints: [
      "Track the minimum price seen so far",
      "At each step calculate profit as current price minus minimum",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    description:
      "Find the length of the longest substring without repeating characters using sliding window.",
    difficulty: "Medium",
    topic: "Sliding Window",
    companies: ["Amazon", "Google", "Microsoft", "Adobe"],
    leetcodeUrl:
      "https://leetcode.com/problems/longest-substring-without-repeating-characters",
    hints: [
      "Use two pointers for a sliding window",
      "Use a set to track characters in current window",
      "Move left pointer when duplicate found",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n,m))",
  },
  {
    title: "Reverse Linked List",
    slug: "reverse-linked-list",
    description: "Reverse a singly linked list in place.",
    difficulty: "Easy",
    topic: "Linked Lists",
    companies: ["Amazon", "Microsoft", "Apple", "Adobe"],
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list",
    hints: [
      "Use three pointers: prev, current, and next",
      "At each step point current.next to prev then advance all three",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    description:
      "Merge two sorted linked lists and return the merged list in sorted order.",
    difficulty: "Easy",
    topic: "Linked Lists",
    companies: ["Amazon", "Google", "Microsoft"],
    leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists",
    hints: [
      "Use a dummy head node to simplify edge cases",
      "Compare values at each step and advance the smaller pointer",
    ],
    timeComplexity: "O(n+m)",
    spaceComplexity: "O(1)",
  },
  {
    title: "Maximum Depth of Binary Tree",
    slug: "maximum-depth-of-binary-tree",
    description: "Find the maximum depth of a binary tree.",
    difficulty: "Easy",
    topic: "Trees",
    companies: ["Amazon", "Google", "LinkedIn"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree",
    hints: [
      "Recursive DFS: depth equals 1 plus max of left and right subtree depths",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) where h is height",
  },
  {
    title: "Validate Binary Search Tree",
    slug: "validate-binary-search-tree",
    description: "Determine if a binary tree is a valid binary search tree.",
    difficulty: "Medium",
    topic: "Trees",
    companies: ["Amazon", "Microsoft", "Facebook", "Bloomberg"],
    leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree",
    hints: [
      "Pass min and max bounds as parameters during recursion",
      "Every node must be strictly between its bounds",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
  },
  {
    title: "Binary Search",
    slug: "binary-search",
    description:
      "Implement binary search on a sorted array to find a target value.",
    difficulty: "Easy",
    topic: "Binary Search",
    companies: ["Google", "Microsoft", "Amazon", "Apple"],
    leetcodeUrl: "https://leetcode.com/problems/binary-search",
    hints: [
      "Use left and right pointers",
      "Calculate mid and compare to target",
      "Move appropriate pointer based on comparison",
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
  },
  {
    title: "Number of Islands",
    slug: "number-of-islands",
    description: "Count the number of islands in a 2D grid using DFS or BFS.",
    difficulty: "Medium",
    topic: "Graphs",
    companies: ["Amazon", "Google", "Microsoft", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands",
    hints: [
      "Run DFS from each unvisited land cell",
      "Mark visited cells to avoid counting them again",
    ],
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
  },
  {
    title: "Clone Graph",
    slug: "clone-graph",
    description: "Return a deep copy of an undirected graph.",
    difficulty: "Medium",
    topic: "Graphs",
    companies: ["Facebook", "Amazon", "Google"],
    leetcodeUrl: "https://leetcode.com/problems/clone-graph",
    hints: [
      "Use a hash map from original node to its clone",
      "BFS or DFS to traverse and clone all nodes",
    ],
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V)",
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    description:
      "Count the number of distinct ways to climb n stairs taking 1 or 2 steps at a time.",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    companies: ["Amazon", "Google", "Apple", "Adobe"],
    leetcodeUrl: "https://leetcode.com/problems/climbing-stairs",
    hints: ["This is the Fibonacci sequence", "dp[i] = dp[i-1] + dp[i-2]"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    description:
      "Find the minimum number of coins needed to make up a given amount.",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    companies: ["Amazon", "Google", "Microsoft", "Goldman Sachs"],
    leetcodeUrl: "https://leetcode.com/problems/coin-change",
    hints: [
      "Bottom-up DP",
      "dp[i] represents minimum coins to make amount i",
      "For each amount try all coin denominations",
    ],
    timeComplexity: "O(amount * coins)",
    spaceComplexity: "O(amount)",
  },
  {
    title: "LRU Cache",
    slug: "lru-cache",
    description:
      "Design a data structure implementing Least Recently Used cache with O(1) get and put operations.",
    difficulty: "Medium",
    topic: "Design",
    companies: ["Amazon", "Google", "Microsoft", "Facebook", "Uber"],
    leetcodeUrl: "https://leetcode.com/problems/lru-cache",
    hints: [
      "Combine a HashMap with a doubly linked list",
      "HashMap gives O(1) access, linked list gives O(1) insertion and deletion",
    ],
    timeComplexity: "O(1) for both get and put",
    spaceComplexity: "O(capacity)",
  },
  {
    title: "Top K Frequent Elements",
    slug: "top-k-frequent-elements",
    description: "Return the k most frequently occurring elements in an array.",
    difficulty: "Medium",
    topic: "Heaps",
    companies: ["Amazon", "Facebook", "Google", "Uber"],
    leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements",
    hints: [
      "Count frequencies using a hash map",
      "Use a min-heap of size k to track top elements",
    ],
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(n)",
  },
  {
    title: "Merge K Sorted Lists",
    slug: "merge-k-sorted-lists",
    description: "Merge k sorted linked lists into one sorted linked list.",
    difficulty: "Hard",
    topic: "Heaps",
    companies: ["Amazon", "Google", "Microsoft", "Facebook"],
    leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists",
    hints: [
      "Use a min-heap initialized with head of each list",
      "Always extract minimum and push next node from that list",
    ],
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
  },
  {
    title: "Word Search",
    slug: "word-search",
    description:
      "Given a 2D board of characters, determine if a word exists by moving to adjacent cells.",
    difficulty: "Medium",
    topic: "Backtracking",
    companies: ["Amazon", "Microsoft", "Snapchat"],
    leetcodeUrl: "https://leetcode.com/problems/word-search",
    hints: [
      "DFS with backtracking from each starting cell",
      "Mark cell as visited before recursing and unmark after",
    ],
    timeComplexity: "O(m*n*4^L)",
    spaceComplexity: "O(L)",
  },
  {
    title: "Meeting Rooms II",
    slug: "meeting-rooms-ii",
    description:
      "Find the minimum number of conference rooms required for all meetings.",
    difficulty: "Medium",
    topic: "Intervals",
    companies: ["Google", "Facebook", "Amazon", "Uber"],
    leetcodeUrl: "https://leetcode.com/problems/meeting-rooms-ii",
    hints: [
      "Sort meetings by start time",
      "Use a min-heap to track earliest ending meeting",
    ],
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
  },
  {
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    description:
      "Calculate the total amount of rainwater that can be trapped between elevation bars.",
    difficulty: "Hard",
    topic: "Arrays",
    companies: ["Amazon", "Google", "Facebook", "Goldman Sachs"],
    leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water",
    hints: [
      "Two pointer approach",
      "Water at position i equals min of max left and max right height minus current height",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },
  {
    title: "Course Schedule",
    slug: "course-schedule",
    description:
      "Determine if you can finish all courses given prerequisite pairs. Cycle detection in directed graph.",
    difficulty: "Medium",
    topic: "Graphs",
    companies: ["Amazon", "Google", "Facebook", "Uber"],
    leetcodeUrl: "https://leetcode.com/problems/course-schedule",
    hints: [
      "Model as a directed graph",
      "Use DFS with three states: unvisited, visiting, visited",
      "A cycle means cannot finish all courses",
    ],
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V+E)",
  },
  {
    title: "Longest Common Subsequence",
    slug: "longest-common-subsequence",
    description:
      "Find the length of the longest common subsequence between two strings.",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    companies: ["Google", "Microsoft", "Amazon"],
    leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence",
    hints: [
      "Build a 2D DP table",
      "If characters match: dp[i][j] = 1 + dp[i-1][j-1]",
      "Otherwise: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
    ],
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    // insert all problems directly — no embeddings needed
    await Problem.insertMany(problems);

    console.log(`Seeded ${problems.length} problems successfully`);
    mongoose.connection.close();
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seed();
