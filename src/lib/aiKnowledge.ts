export interface KnowledgeStage {
  level: number;
  title: string;
  topics: string[];
  description: string;
  unlockRequirement: string;
}

export const AI_KNOWLEDGE_STAGES: KnowledgeStage[] = [
  {
    level: 1,
    title: "SYNTATIC PROTOCOLS",
    topics: ["Variables", "Data Types", "Operators"],
    description: "Fundamental building blocks of code.",
    unlockRequirement: "Starting Level",
  },
  {
    level: 2,
    title: "LOGIC GATES",
    topics: ["If/Else", "Comparison", "Booleans"],
    description: "Decision-making logic pathways.",
    unlockRequirement: "Reach Level 2",
  },
  {
    level: 3,
    title: "ITERATIVE LOOPS",
    topics: ["Loops", "Arrays", "Lists"],
    description: "Repetitive tasks and collections.",
    unlockRequirement: "5 Races Completed",
  },
  {
    level: 4,
    title: "FUNCTIONAL ENGINES",
    topics: ["Functions", "Scopes", "Arguments"],
    description: "Modular code analysis and advice.",
    unlockRequirement: "Reach Level 5",
  },
  {
    level: 5,
    title: "STRUCTURAL ARCHITECT",
    topics: ["Classes", "Objects", "Inheritance"],
    description: "Object-Oriented patterns and structures.",
    unlockRequirement: "15 Race Wins",
  },
  {
    level: 6,
    title: "SHIELD & RECOVERY",
    topics: ["Error Handling", "Debugging"],
    description: "Troubleshooting and defensive coding.",
    unlockRequirement: "30 Correct Answers",
  },
  {
    level: 7,
    title: "ASYNC CHRONICLES",
    topics: ["Promises", "Callbacks", "Await"],
    description: "Timed operations and async flows.",
    unlockRequirement: "Reach Level 10",
  },
  {
    level: 8,
    title: "ALGORITHMIC MASTER",
    topics: ["Sorting", "Complexity", "Big O"],
    description: "Efficiency optimization analysis.",
    unlockRequirement: "50 Race Wins",
  },
  {
    level: 9,
    title: "SYSTEM INTEGRATOR",
    topics: ["APIs", "Database", "Networking"],
    description: "Full-stack communication systems.",
    unlockRequirement: "Reach Level 15",
  },
  {
    level: 10,
    title: "THE SINGULARITY",
    topics: ["Scalability", "Architecture"],
    description: "Maximum advice depth.",
    unlockRequirement: "100 Perfect Races",
  },
];

export const getCurrentKnowledgeStage = (level: number): KnowledgeStage => {
  // Map user level (0-100+) to knowledge level (1-10)
  // For simplicity: Stage = floor(userLevel / 2) + 1, capped at 10
  const stageLevel = Math.min(10, Math.floor(level / 2) + 1);
  return AI_KNOWLEDGE_STAGES.find(s => s.level === stageLevel) || AI_KNOWLEDGE_STAGES[0];
};

export const isTopicUnlocked = (topic: string, currentLevel: number): boolean => {
  const stage = getCurrentKnowledgeStage(currentLevel);
  // Check if topic is in this stage or any lower stage
  const unlockedStages = AI_KNOWLEDGE_STAGES.filter(s => s.level <= stage.level);
  return unlockedStages.some(s => s.topics.map(t => t.toLowerCase()).includes(topic.toLowerCase()));
};
