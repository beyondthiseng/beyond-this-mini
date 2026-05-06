// src/data/questions/basic.ts
import type { QuestionSet } from '../../types/questions';

export const basicQuestions: QuestionSet = {
  level: 'basic',

  // ── VOCABULARY (8문항) ────────────────────────────────────────
  vocabulary: [
    {
      id: 'bv1', type: 'standalone', area: 'vocabulary', level: 'basic', difficulty: 1,
      q: "What does 'big' mean?",
      o: ["small", "large", "fast", "cold"],
      a: 1,
    },
    {
      id: 'bv2', type: 'standalone', area: 'vocabulary', level: 'basic', difficulty: 1,
      q: "Which word means the opposite of 'hot'?",
      o: ["warm", "cool", "cold", "dry"],
      a: 2,
    },
    {
      id: 'bv3', type: 'standalone', area: 'vocabulary', level: 'basic', difficulty: 2,
      q: "'Happy' means ___.",
      o: ["sad", "tired", "glad", "angry"],
      a: 2,
    },
    {
      id: 'bv4', type: 'standalone', area: 'vocabulary', level: 'basic', difficulty: 2,
      q: "A place where you sleep is called a ___.",
      o: ["kitchen", "bedroom", "garden", "office"],
      a: 1,
    },
    {
      id: 'bv5', type: 'standalone', area: 'vocabulary', level: 'basic', difficulty: 2,
      q: "'Many' means ___.",
      o: ["none", "a little", "a lot", "one"],
      a: 2,
    },
    {
      id: 'bv6', type: 'standalone', area: 'vocabulary', level: 'basic', difficulty: 3,
      q: "Which word describes how something looks?",
      o: ["run", "red", "eat", "jump"],
      a: 1,
    },
    {
      id: 'bv7', type: 'standalone', area: 'vocabulary', level: 'basic', difficulty: 3,
      q: "'Tired' means you want to ___.",
      o: ["eat", "play", "sleep", "run"],
      a: 2,
    },
    {
      id: 'bv8', type: 'standalone', area: 'vocabulary', level: 'basic', difficulty: 3,
      q: "Which word is an animal?",
      o: ["table", "chair", "rabbit", "pencil"],
      a: 2,
    },
  ],

  // ── GRAMMAR (7문항) ───────────────────────────────────────────
  grammar: [
    {
      id: 'bg1', type: 'standalone', area: 'grammar', level: 'basic', difficulty: 1,
      q: "She ___ to school every day.",
      o: ["go", "goes", "going", "gone"],
      a: 1,
    },
    {
      id: 'bg2', type: 'standalone', area: 'grammar', level: 'basic', difficulty: 1,
      q: "Which sentence is correct?",
      o: ["I am a student.", "I are a student.", "I is a student.", "I be a student."],
      a: 0,
    },
    {
      id: 'bg3', type: 'standalone', area: 'grammar', level: 'basic', difficulty: 2,
      q: "The cat sat ___ the mat.",
      o: ["in", "on", "at", "by"],
      a: 1,
    },
    {
      id: 'bg4', type: 'standalone', area: 'grammar', level: 'basic', difficulty: 2,
      q: "He ___ a book yesterday.",
      o: ["read", "reads", "reading", "to read"],
      a: 0,
    },
    {
      id: 'bg5', type: 'standalone', area: 'grammar', level: 'basic', difficulty: 2,
      q: "There ___ two dogs in the park.",
      o: ["is", "are", "was", "am"],
      a: 1,
    },
    {
      id: 'bg6', type: 'standalone', area: 'grammar', level: 'basic', difficulty: 3,
      q: "Which word is a verb?",
      o: ["happy", "quickly", "run", "blue"],
      a: 2,
    },
    {
      id: 'bg7', type: 'standalone', area: 'grammar', level: 'basic', difficulty: 3,
      q: "I ___ my homework before dinner.",
      o: ["do", "did", "does", "doing"],
      a: 1,
    },
  ],

  // ── READING PASSAGES ──────────────────────────────────────────
  passages: {
    // 짧은 지문 (3문항)
    short: {
      id: 'bp_short', type: 'passage', level: 'basic', size: 'short',
      title: 'A Dog Named Max',
      genre: 'fiction',
      passage: `Tom has a dog named Max. Max is big and brown. Every morning, Tom and Max go to the park. Max loves to run and play. Tom is happy when Max is happy.`,
      questions: [
        {
          id: 'bp_s1', skill: 'character',
          q: "Who is Max?",
          o: ["Tom's friend", "Tom's dog", "Tom's teacher", "Tom's brother"],
          a: 1,
        },
        {
          id: 'bp_s2', skill: 'detail',
          q: "Where do Tom and Max go every morning?",
          o: ["to school", "to the store", "to the park", "to the beach"],
          a: 2,
        },
        {
          id: 'bp_s3', skill: 'main_idea',
          q: "What is this story mostly about?",
          o: ["a boy and his dog", "a park near a school", "a big brown animal", "a happy morning"],
          a: 0,
        },
      ],
    },

    // 중간 지문 (5문항)
    medium: {
      id: 'bp_medium', type: 'passage', level: 'basic', size: 'medium',
      title: 'The Little Seed',
      genre: 'fiction',
      passage: `A little seed fell into the ground. The sun shone on the ground. The rain fell on the ground. The seed started to grow. First, a small green shoot came up. Then, leaves began to open. Finally, a beautiful flower bloomed. The flower was yellow and bright. A bee came to visit the flower. The bee was happy to find such a beautiful flower.`,
      questions: [
        {
          id: 'bp_m1', skill: 'sequence',
          q: "What happened FIRST after the seed was in the ground?",
          o: ["A flower bloomed.", "Leaves opened.", "A small shoot came up.", "A bee came."],
          a: 2,
        },
        {
          id: 'bp_m2', skill: 'detail',
          q: "What color was the flower?",
          o: ["red", "blue", "green", "yellow"],
          a: 3,
        },
        {
          id: 'bp_m3', skill: 'detail',
          q: "What did the seed need to grow?",
          o: ["sun and rain", "wind and snow", "birds and bees", "soil and rocks"],
          a: 0,
        },
        {
          id: 'bp_m4', skill: 'main_idea',
          q: "What is this story mainly about?",
          o: ["how a bee finds food", "how a seed grows into a flower", "why flowers are yellow", "where seeds come from"],
          a: 1,
        },
        {
          id: 'bp_m5', skill: 'vocabulary_in_context',
          q: "In the story, 'bloomed' means ___.",
          o: ["fell down", "opened up", "went away", "stayed small"],
          a: 1,
        },
      ],
    },

    // 긴 지문 (7문항)
    long: {
      id: 'bp_long', type: 'passage', level: 'basic', size: 'long',
      title: 'Penguins',
      genre: 'nonfiction',
      passage: `Penguins are interesting birds. They cannot fly, but they are very good swimmers. Penguins live in cold places. Many penguins live in Antarctica, where it is very cold and snowy.

Penguins have black and white feathers. The black feathers keep them warm. They eat fish and other sea animals. They use their wings to swim fast in the water.

Penguins live in large groups called colonies. In a colony, penguins keep each other warm. Baby penguins are called chicks. The mother and father penguin take turns keeping the egg warm. When the chick hatches, both parents feed it.

Penguins are amazing animals. They have learned to live in one of the coldest places on Earth.`,
      questions: [
        {
          id: 'bp_l1', skill: 'main_idea',
          q: "What is the main idea of this passage?",
          o: ["Penguins are good at flying.", "Penguins are interesting birds that live in cold places.", "All birds live in cold places.", "Baby penguins are called chicks."],
          a: 1,
        },
        {
          id: 'bp_l2', skill: 'detail',
          q: "Where do many penguins live?",
          o: ["in the jungle", "in the desert", "in Antarctica", "in the ocean"],
          a: 2,
        },
        {
          id: 'bp_l3', skill: 'detail',
          q: "What do penguins eat?",
          o: ["grass and plants", "fish and sea animals", "nuts and berries", "insects and worms"],
          a: 1,
        },
        {
          id: 'bp_l4', skill: 'vocabulary_in_context',
          q: "In the passage, a 'colony' is ___.",
          o: ["a type of fish", "a large group of penguins", "a cold place", "a baby penguin"],
          a: 1,
        },
        {
          id: 'bp_l5', skill: 'detail',
          q: "What are baby penguins called?",
          o: ["cubs", "pups", "kittens", "chicks"],
          a: 3,
        },
        {
          id: 'bp_l6', skill: 'inference',
          q: "Why do penguins live in groups?",
          o: ["to find more fish", "to keep each other warm", "to fly together", "to build nests"],
          a: 1,
        },
        {
          id: 'bp_l7', skill: 'detail',
          q: "How do penguins use their wings?",
          o: ["to fly", "to dig", "to swim", "to fight"],
          a: 2,
        },
      ],
    },
  },
};
