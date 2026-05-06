// src/data/questions/lowerIntermediate.ts
import type { QuestionSet } from '../../types/questions';

export const lowerIntermediateQuestions: QuestionSet = {
  level: 'lower_intermediate',

  // ── VOCABULARY (8문항) ────────────────────────────────────────
  vocabulary: [
    {
      id: 'lv1', type: 'standalone', area: 'vocabulary', level: 'lower_intermediate', difficulty: 1,
      q: "'Discover' means to ___.",
      o: ["lose something", "find something new", "break something", "forget something"],
      a: 1,
    },
    {
      id: 'lv2', type: 'standalone', area: 'vocabulary', level: 'lower_intermediate', difficulty: 1,
      q: "Which word means 'very surprised'?",
      o: ["bored", "astonished", "tired", "confused"],
      a: 1,
    },
    {
      id: 'lv3', type: 'standalone', area: 'vocabulary', level: 'lower_intermediate', difficulty: 2,
      q: "'Ancient' means ___.",
      o: ["very new", "very old", "very big", "very small"],
      a: 1,
    },
    {
      id: 'lv4', type: 'standalone', area: 'vocabulary', level: 'lower_intermediate', difficulty: 2,
      q: "The opposite of 'frequently' is ___.",
      o: ["always", "never", "rarely", "usually"],
      a: 2,
    },
    {
      id: 'lv5', type: 'standalone', area: 'vocabulary', level: 'lower_intermediate', difficulty: 2,
      q: "'Enormous' is closest in meaning to ___.",
      o: ["tiny", "fast", "huge", "loud"],
      a: 2,
    },
    {
      id: 'lv6', type: 'standalone', area: 'vocabulary', level: 'lower_intermediate', difficulty: 3,
      q: "If something is 'fragile', you should handle it ___.",
      o: ["quickly", "roughly", "carefully", "loudly"],
      a: 2,
    },
    {
      id: 'lv7', type: 'standalone', area: 'vocabulary', level: 'lower_intermediate', difficulty: 3,
      q: "'Migrate' means to ___.",
      o: ["stay in one place", "move from one place to another", "build a new home", "look for food"],
      a: 1,
    },
    {
      id: 'lv8', type: 'standalone', area: 'vocabulary', level: 'lower_intermediate', difficulty: 3,
      q: "A 'habitat' is ___.",
      o: ["what an animal eats", "where an animal lives", "how an animal moves", "why animals sleep"],
      a: 1,
    },
  ],

  // ── GRAMMAR (7문항) ───────────────────────────────────────────
  grammar: [
    {
      id: 'lg1', type: 'standalone', area: 'grammar', level: 'lower_intermediate', difficulty: 1,
      q: "She ___ TV when I called her.",
      o: ["watch", "watches", "was watching", "watched"],
      a: 2,
    },
    {
      id: 'lg2', type: 'standalone', area: 'grammar', level: 'lower_intermediate', difficulty: 1,
      q: "Which sentence is correct?",
      o: ["She don't like carrots.", "She doesn't likes carrots.", "She doesn't like carrots.", "She not like carrots."],
      a: 2,
    },
    {
      id: 'lg3', type: 'standalone', area: 'grammar', level: 'lower_intermediate', difficulty: 2,
      q: "Despite the rain, the game ___.",
      o: ["continue", "continues", "continued", "continuing"],
      a: 2,
    },
    {
      id: 'lg4', type: 'standalone', area: 'grammar', level: 'lower_intermediate', difficulty: 2,
      q: "If I ___ more time, I would read more books.",
      o: ["have", "had", "has", "having"],
      a: 1,
    },
    {
      id: 'lg5', type: 'standalone', area: 'grammar', level: 'lower_intermediate', difficulty: 2,
      q: "Which is a compound sentence?",
      o: ["She runs fast.", "She runs, and he walks.", "Running is fun.", "She ran fast yesterday."],
      a: 1,
    },
    {
      id: 'lg6', type: 'standalone', area: 'grammar', level: 'lower_intermediate', difficulty: 3,
      q: "By the time we arrived, the movie ___.",
      o: ["already started", "had already started", "already starts", "is already starting"],
      a: 1,
    },
    {
      id: 'lg7', type: 'standalone', area: 'grammar', level: 'lower_intermediate', difficulty: 3,
      q: "'Although she was tired, she finished her homework.' What does 'although' show?",
      o: ["a reason", "a result", "a contrast", "a sequence"],
      a: 2,
    },
  ],

  // ── READING PASSAGES ──────────────────────────────────────────
  passages: {
    // 짧은 지문 (3문항)
    short: {
      id: 'lp_short', type: 'passage', level: 'lower_intermediate', size: 'short',
      title: 'Recycling Helps the Earth',
      genre: 'informational',
      passage: `Every day, people throw away a lot of trash. Much of this trash goes to landfills, which take up a lot of space and can harm the environment. Recycling helps solve this problem. When we recycle, we turn old materials like paper, plastic, and glass into new products. Recycling reduces waste and saves energy. It also protects natural resources like trees and water.`,
      questions: [
        {
          id: 'lp_s1', skill: 'main_idea',
          q: "What is the main idea of this passage?",
          o: ["Landfills are very large places.", "Recycling helps the environment.", "People throw away too much trash.", "Paper and plastic can be reused."],
          a: 1,
        },
        {
          id: 'lp_s2', skill: 'detail',
          q: "According to the passage, what does recycling save?",
          o: ["money and time", "energy and natural resources", "space and water", "food and paper"],
          a: 1,
        },
        {
          id: 'lp_s3', skill: 'vocabulary_in_context',
          q: "In the passage, 'reduces' means ___.",
          o: ["increases", "removes", "makes less", "creates more"],
          a: 2,
        },
      ],
    },

    // 중간 지문 (5문항)
    medium: {
      id: 'lp_medium', type: 'passage', level: 'lower_intermediate', size: 'medium',
      title: 'How Butterflies Change',
      genre: 'nonfiction',
      passage: `Butterflies go through four stages of life. This process is called metamorphosis. First, a butterfly lays eggs on a leaf. The eggs are very small. Next, a caterpillar hatches from the egg. The caterpillar eats leaves and grows bigger every day.

After growing for several weeks, the caterpillar makes a protective covering called a chrysalis. Inside the chrysalis, the caterpillar slowly changes. Finally, after about two weeks, a beautiful butterfly comes out. The butterfly dries its wings and flies away.

The whole process can take anywhere from a few weeks to several months, depending on the species of butterfly.`,
      questions: [
        {
          id: 'lp_m1', skill: 'sequence',
          q: "What is the correct order of a butterfly's life?",
          o: [
            "egg → butterfly → caterpillar → chrysalis",
            "caterpillar → egg → chrysalis → butterfly",
            "egg → caterpillar → chrysalis → butterfly",
            "chrysalis → egg → caterpillar → butterfly",
          ],
          a: 2,
        },
        {
          id: 'lp_m2', skill: 'vocabulary_in_context',
          q: "In the passage, 'metamorphosis' means ___.",
          o: ["a type of butterfly", "the process of life change", "a protective covering", "a type of leaf"],
          a: 1,
        },
        {
          id: 'lp_m3', skill: 'detail',
          q: "What does the caterpillar do inside the chrysalis?",
          o: ["eats leaves", "lays eggs", "slowly changes", "dries its wings"],
          a: 2,
        },
        {
          id: 'lp_m4', skill: 'main_idea',
          q: "What is this passage mainly about?",
          o: ["what butterflies eat", "where butterflies live", "how butterflies develop through stages", "why butterflies have colorful wings"],
          a: 2,
        },
        {
          id: 'lp_m5', skill: 'inference',
          q: "Why do you think the passage says the time 'depends on the species'?",
          o: ["because all butterflies are the same", "because different butterflies change at different speeds", "because caterpillars eat different foods", "because weather changes every year"],
          a: 1,
        },
      ],
    },

    // 긴 지문 (7문항)
    long: {
      id: 'lp_long', type: 'passage', level: 'lower_intermediate', size: 'long',
      title: 'The Amazon Rainforest',
      genre: 'informational',
      passage: `The Amazon Rainforest is the largest tropical rainforest in the world. It covers most of the Amazon River basin in South America. The Amazon is home to an amazing variety of plants and animals. Scientists believe that more than 10% of all species on Earth live there.

The rainforest has four main layers. The emergent layer is at the very top, where the tallest trees reach up to 60 meters. Below that is the canopy, a thick roof of leaves that blocks most sunlight. The understory is a dark, quiet layer where plants grow slowly. On the ground, the forest floor is covered with fallen leaves and decomposing material.

The Amazon plays a vital role in regulating Earth's climate. Its trees absorb millions of tons of carbon dioxide each year and release oxygen. This is why the Amazon is often called "the lungs of the Earth."

Unfortunately, the Amazon is being destroyed. Farmers cut down trees to create farmland. Companies build roads and mines in the forest. Scientists warn that if this continues, many species will become extinct and the climate will change dramatically. Many countries and organizations are working together to protect this important ecosystem before it is too late.`,
      questions: [
        {
          id: 'lp_l1', skill: 'main_idea',
          q: "What is the main topic of this passage?",
          o: ["the Amazon River's fish", "why climate change is dangerous", "the Amazon Rainforest and its importance", "how farmers use the land in South America"],
          a: 2,
        },
        {
          id: 'lp_l2', skill: 'detail',
          q: "How many layers does the Amazon Rainforest have?",
          o: ["two", "three", "four", "five"],
          a: 2,
        },
        {
          id: 'lp_l3', skill: 'vocabulary_in_context',
          q: "In the passage, 'vital' means ___.",
          o: ["unimportant", "extremely important", "very old", "dangerous"],
          a: 1,
        },
        {
          id: 'lp_l4', skill: 'cause_effect',
          q: "Why is the Amazon called 'the lungs of the Earth'?",
          o: ["because it is very large", "because animals breathe there", "because it absorbs CO2 and releases oxygen", "because it has four layers"],
          a: 2,
        },
        {
          id: 'lp_l5', skill: 'detail',
          q: "What happens on the forest floor?",
          o: ["tall trees grow up to 60 meters", "leaves decompose on the ground", "thick leaves block the sunlight", "plants grow slowly in darkness"],
          a: 1,
        },
        {
          id: 'lp_l6', skill: 'inference',
          q: "What will most likely happen if the Amazon continues to be destroyed?",
          o: ["more animals will move there", "the climate will improve", "many species will become extinct", "farmers will stop cutting trees"],
          a: 2,
        },
        {
          id: 'lp_l7', skill: 'fact_opinion',
          q: "Which statement from the passage is a FACT?",
          o: [
            "The Amazon is the most beautiful forest.",
            "Scientists believe more than 10% of Earth's species live there.",
            "People should stop farming in South America.",
            "The forest floor is the most interesting layer.",
          ],
          a: 1,
        },
      ],
    },
  },
};
