const questionGroups = {
  "Arrays & Hashing": {
    "Array Basics": [
      ["Two Sum", "Easy", "https://leetcode.com/problems/two-sum/"],
      ["Best Time to Buy and Sell Stock", "Easy", "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"],
      ["Contains Duplicate", "Easy", "https://leetcode.com/problems/contains-duplicate/"],
      ["Product of Array Except Self", "Medium", "https://leetcode.com/problems/product-of-array-except-self/"],
      ["Maximum Subarray", "Medium", "https://leetcode.com/problems/maximum-subarray/"],
    ],
    "Matrix and Intervals": [
      ["Set Matrix Zeroes", "Medium", "https://leetcode.com/problems/set-matrix-zeroes/"],
      ["Rotate Image", "Medium", "https://leetcode.com/problems/rotate-image/"],
      ["Merge Intervals", "Medium", "https://leetcode.com/problems/merge-intervals/"],
      ["3Sum", "Medium", "https://leetcode.com/problems/3sum/"],
      ["Missing Number", "Easy", "https://leetcode.com/problems/missing-number/"],
    ],
  },
  "Binary Search": {
    "Search in Sorted Arrays": [
      ["Binary Search", "Easy", "https://leetcode.com/problems/binary-search/"],
      ["Search Insert Position", "Easy", "https://leetcode.com/problems/search-insert-position/"],
      ["Search in Rotated Sorted Array", "Medium", "https://leetcode.com/problems/search-in-rotated-sorted-array/"],
      ["Find Minimum in Rotated Sorted Array", "Medium", "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"],
      ["Median of Two Sorted Arrays", "Hard", "https://leetcode.com/problems/median-of-two-sorted-arrays/"],
    ],
    "Binary Search on Answer": [
      ["Koko Eating Bananas", "Medium", "https://leetcode.com/problems/koko-eating-bananas/"],
      ["Capacity To Ship Packages Within D Days", "Medium", "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/"],
      ["Search a 2D Matrix", "Medium", "https://leetcode.com/problems/search-a-2d-matrix/"],
    ],
  },
  Strings: {
    "String Basics": [
      ["Valid Anagram", "Easy", "https://leetcode.com/problems/valid-anagram/"],
      ["Valid Palindrome", "Easy", "https://leetcode.com/problems/valid-palindrome/"],
      ["Group Anagrams", "Medium", "https://leetcode.com/problems/group-anagrams/"],
      ["Longest Palindromic Substring", "Medium", "https://leetcode.com/problems/longest-palindromic-substring/"],
      ["Longest Substring Without Repeating Characters", "Medium", "https://leetcode.com/problems/longest-substring-without-repeating-characters/"],
    ],
    "Sliding Window": [
      ["Minimum Window Substring", "Hard", "https://leetcode.com/problems/minimum-window-substring/"],
      ["Permutation in String", "Medium", "https://leetcode.com/problems/permutation-in-string/"],
      ["Find All Anagrams in a String", "Medium", "https://leetcode.com/problems/find-all-anagrams-in-a-string/"],
    ],
  },
  "Linked Lists": {
    "Singly Linked Lists": [
      ["Reverse Linked List", "Easy", "https://leetcode.com/problems/reverse-linked-list/"],
      ["Merge Two Sorted Lists", "Easy", "https://leetcode.com/problems/merge-two-sorted-lists/"],
      ["Linked List Cycle", "Easy", "https://leetcode.com/problems/linked-list-cycle/"],
      ["Remove Nth Node From End of List", "Medium", "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"],
      ["Add Two Numbers", "Medium", "https://leetcode.com/problems/add-two-numbers/"],
    ],
    "Advanced Linked Lists": [
      ["Copy List with Random Pointer", "Medium", "https://leetcode.com/problems/copy-list-with-random-pointer/"],
      ["Reorder List", "Medium", "https://leetcode.com/problems/reorder-list/"],
      ["LRU Cache", "Medium", "https://leetcode.com/problems/lru-cache/"],
    ],
  },
  "Trees": {
    "Binary Trees": [
      ["Maximum Depth of Binary Tree", "Easy", "https://leetcode.com/problems/maximum-depth-of-binary-tree/"],
      ["Same Tree", "Easy", "https://leetcode.com/problems/same-tree/"],
      ["Invert Binary Tree", "Easy", "https://leetcode.com/problems/invert-binary-tree/"],
      ["Binary Tree Level Order Traversal", "Medium", "https://leetcode.com/problems/binary-tree-level-order-traversal/"],
      ["Diameter of Binary Tree", "Easy", "https://leetcode.com/problems/diameter-of-binary-tree/"],
    ],
    "Binary Search Trees": [
      ["Validate Binary Search Tree", "Medium", "https://leetcode.com/problems/validate-binary-search-tree/"],
      ["Lowest Common Ancestor of a Binary Search Tree", "Medium", "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/"],
      ["Kth Smallest Element in a BST", "Medium", "https://leetcode.com/problems/kth-smallest-element-in-a-bst/"],
    ],
  },
  "Graphs": {
    "Graph Traversal": [
      ["Number of Islands", "Medium", "https://leetcode.com/problems/number-of-islands/"],
      ["Clone Graph", "Medium", "https://leetcode.com/problems/clone-graph/"],
      ["Rotting Oranges", "Medium", "https://leetcode.com/problems/rotting-oranges/"],
      ["Pacific Atlantic Water Flow", "Medium", "https://leetcode.com/problems/pacific-atlantic-water-flow/"],
    ],
    "Topological Sort and Paths": [
      ["Course Schedule", "Medium", "https://leetcode.com/problems/course-schedule/"],
      ["Course Schedule II", "Medium", "https://leetcode.com/problems/course-schedule-ii/"],
      ["Word Ladder", "Hard", "https://leetcode.com/problems/word-ladder/"],
    ],
  },
  "Dynamic Programming": {
    "One-Dimensional DP": [
      ["Climbing Stairs", "Easy", "https://leetcode.com/problems/climbing-stairs/"],
      ["House Robber", "Medium", "https://leetcode.com/problems/house-robber/"],
      ["Coin Change", "Medium", "https://leetcode.com/problems/coin-change/"],
      ["Longest Increasing Subsequence", "Medium", "https://leetcode.com/problems/longest-increasing-subsequence/"],
    ],
    "DP on Strings and Subsets": [
      ["Longest Common Subsequence", "Medium", "https://leetcode.com/problems/longest-common-subsequence/"],
      ["Word Break", "Medium", "https://leetcode.com/problems/word-break/"],
      ["Partition Equal Subset Sum", "Medium", "https://leetcode.com/problems/partition-equal-subset-sum/"],
      ["Unique Paths", "Medium", "https://leetcode.com/problems/unique-paths/"],
    ],
  },
  Greedy: {
    "Greedy and Scheduling": [
      ["Jump Game", "Medium", "https://leetcode.com/problems/jump-game/"],
      ["Jump Game II", "Medium", "https://leetcode.com/problems/jump-game-ii/"],
      ["Gas Station", "Medium", "https://leetcode.com/problems/gas-station/"],
      ["Non-overlapping Intervals", "Medium", "https://leetcode.com/problems/non-overlapping-intervals/"],
      ["Hand of Straights", "Medium", "https://leetcode.com/problems/hand-of-straights/"],
    ],
  },
  "Stacks and Queues": {
    "Stack Problems": [
      ["Valid Parentheses", "Easy", "https://leetcode.com/problems/valid-parentheses/"],
      ["Min Stack", "Medium", "https://leetcode.com/problems/min-stack/"],
      ["Daily Temperatures", "Medium", "https://leetcode.com/problems/daily-temperatures/"],
      ["Largest Rectangle in Histogram", "Hard", "https://leetcode.com/problems/largest-rectangle-in-histogram/"],
      ["Next Greater Element II", "Medium", "https://leetcode.com/problems/next-greater-element-ii/"],
    ],
    "Queues and Design": [
      ["Implement Queue using Stacks", "Easy", "https://leetcode.com/problems/implement-queue-using-stacks/"],
      ["Sliding Window Maximum", "Hard", "https://leetcode.com/problems/sliding-window-maximum/"],
    ],
  },
  "Heaps and Priority Queues": {
    "Heap Problems": [
      ["Kth Largest Element in an Array", "Medium", "https://leetcode.com/problems/kth-largest-element-in-an-array/"],
      ["Top K Frequent Elements", "Medium", "https://leetcode.com/problems/top-k-frequent-elements/"],
      ["Find Median from Data Stream", "Hard", "https://leetcode.com/problems/find-median-from-data-stream/"],
      ["Task Scheduler", "Medium", "https://leetcode.com/problems/task-scheduler/"],
      ["Merge k Sorted Lists", "Hard", "https://leetcode.com/problems/merge-k-sorted-lists/"],
    ],
  },
  Backtracking: {
    "Combinations and Permutations": [
      ["Subsets", "Medium", "https://leetcode.com/problems/subsets/"],
      ["Combination Sum", "Medium", "https://leetcode.com/problems/combination-sum/"],
      ["Permutations", "Medium", "https://leetcode.com/problems/permutations/"],
      ["Subsets II", "Medium", "https://leetcode.com/problems/subsets-ii/"],
    ],
    "Search and Placement": [
      ["Word Search", "Medium", "https://leetcode.com/problems/word-search/"],
      ["N-Queens", "Hard", "https://leetcode.com/problems/n-queens/"],
      ["Palindrome Partitioning", "Medium", "https://leetcode.com/problems/palindrome-partitioning/"],
    ],
  },
  "Bit Manipulation": {
    "Bitwise Operations": [
      ["Single Number", "Easy", "https://leetcode.com/problems/single-number/"],
      ["Number of 1 Bits", "Easy", "https://leetcode.com/problems/number-of-1-bits/"],
      ["Counting Bits", "Easy", "https://leetcode.com/problems/counting-bits/"],
      ["Reverse Bits", "Easy", "https://leetcode.com/problems/reverse-bits/"],
      ["Missing Number", "Easy", "https://leetcode.com/problems/missing-number/"],
    ],
  },
  "Tries and Math": {
    "Trie": [
      ["Implement Trie (Prefix Tree)", "Medium", "https://leetcode.com/problems/implement-trie-prefix-tree/"],
      ["Word Search II", "Hard", "https://leetcode.com/problems/word-search-ii/"],
    ],
    "Math": [
      ["Pow(x, n)", "Medium", "https://leetcode.com/problems/powx-n/"],
      ["Sqrt(x)", "Easy", "https://leetcode.com/problems/sqrtx/"],
      ["Excel Sheet Column Number", "Easy", "https://leetcode.com/problems/excel-sheet-column-number/"],
    ],
  },
}

const topicOrder = Object.keys(questionGroups)
const subTopicOrder = Object.fromEntries(
  Object.entries(questionGroups).map(([topic, subTopics]) => [
    topic,
    Object.keys(subTopics),
  ]),
)

const questions = topicOrder.flatMap((topic, topicIndex) =>
  Object.entries(questionGroups[topic]).flatMap(
    ([subTopic, entries], subTopicIndex) =>
      entries.map(([title, difficulty, problemUrl], questionIndex) => ({
        _id: `seed-${topicIndex}-${subTopicIndex}-${questionIndex}`,
        title,
        topic,
        subTopic,
        difficulty,
        problemUrl,
        resource: "",
        isSolved: false,
      })),
  ),
)

export const initialSheet = {
  sheet: {
    name: "Customizable DSA Tracker & Practice Sheet",
    description:
      "Your personalized workspace to master Data Structures & Algorithms. Build your custom study curriculum, track your problem-solving progress in real time, customize topics and questions with drag-and-drop ordering, and keep your practice seamlessly saved to your account.",
    followers: 0,
    config: {
      topicOrder,
      subTopicOrder,
      questionOrder: {},
    },
  },
  questions,
}
