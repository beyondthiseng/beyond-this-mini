// src/data/questions/advanced.ts
import type { QuestionSet } from '../../types/questions';

export const advancedQuestions: QuestionSet = {
  level: 'advanced',

  vocabulary: [
    {
      id: 'av1', type: 'standalone', area: 'vocabulary', level: 'advanced', difficulty: 1,
      q: "'Ambiguous' most nearly means ___.",
      o: ["perfectly clear", "open to multiple interpretations", "extremely difficult", "completely wrong"],
      a: 1,
    },
    {
      id: 'av2', type: 'standalone', area: 'vocabulary', level: 'advanced', difficulty: 1,
      q: "Something 'paradoxical' seems ___.",
      o: ["straightforward and simple", "contradictory yet possibly true", "completely false", "easily explained"],
      a: 1,
    },
    {
      id: 'av3', type: 'standalone', area: 'vocabulary', level: 'advanced', difficulty: 2,
      q: "'Ubiquitous' means ___.",
      o: ["rare and unusual", "present everywhere", "extremely expensive", "recently created"],
      a: 1,
    },
    {
      id: 'av4', type: 'standalone', area: 'vocabulary', level: 'advanced', difficulty: 2,
      q: "A 'pragmatic' approach focuses on ___.",
      o: ["ideal outcomes", "practical solutions", "emotional responses", "traditional methods"],
      a: 1,
    },
    {
      id: 'av5', type: 'standalone', area: 'vocabulary', level: 'advanced', difficulty: 2,
      q: "'Rhetoric' refers to ___.",
      o: ["scientific research methods", "the art of persuasive speaking or writing", "a type of logical argument", "historical events"],
      a: 1,
    },
    {
      id: 'av6', type: 'standalone', area: 'vocabulary', level: 'advanced', difficulty: 3,
      q: "An 'empirical' claim is based on ___.",
      o: ["logical reasoning alone", "observation and evidence", "expert opinion", "theoretical assumptions"],
      a: 1,
    },
    {
      id: 'av7', type: 'standalone', area: 'vocabulary', level: 'advanced', difficulty: 3,
      q: "'Mitigate' means to ___.",
      o: ["worsen a situation", "make something less severe", "completely solve a problem", "ignore a difficulty"],
      a: 1,
    },
    {
      id: 'av8', type: 'standalone', area: 'vocabulary', level: 'advanced', difficulty: 3,
      q: "A 'fallacy' in an argument is ___.",
      o: ["a strong piece of evidence", "an error in reasoning", "a counter-argument", "a proven fact"],
      a: 1,
    },
  ],

  grammar: [
    {
      id: 'ag1', type: 'standalone', area: 'grammar', level: 'advanced', difficulty: 1,
      q: "Which sentence demonstrates correct parallel structure?",
      o: [
        "She likes running, to swim, and plays tennis.",
        "She likes running, swimming, and playing tennis.",
        "She likes to run, swimming, and plays tennis.",
        "She likes run, swim, and to play tennis.",
      ],
      a: 1,
    },
    {
      id: 'ag2', type: 'standalone', area: 'grammar', level: 'advanced', difficulty: 1,
      q: "Identify the dangling modifier: 'Walking through the park, the flowers looked beautiful.'",
      o: [
        "'Walking through the park' — it is unclear who is walking",
        "'the flowers' — incorrect subject",
        "'looked beautiful' — wrong verb tense",
        "There is no error in this sentence.",
      ],
      a: 0,
    },
    {
      id: 'ag3', type: 'standalone', area: 'grammar', level: 'advanced', difficulty: 2,
      q: "Which best describes the rhetorical purpose of a concessive clause?",
      o: [
        "It states the main argument directly.",
        "It acknowledges an opposing view before making a counter-argument.",
        "It provides supporting evidence for a claim.",
        "It summarizes the conclusion of an argument.",
      ],
      a: 1,
    },
    {
      id: 'ag4', type: 'standalone', area: 'grammar', level: 'advanced', difficulty: 2,
      q: "Had she arrived earlier, she ___ the presentation.",
      o: ["would see", "would have seen", "will see", "sees"],
      a: 1,
    },
    {
      id: 'ag5', type: 'standalone', area: 'grammar', level: 'advanced', difficulty: 2,
      q: "Which transition word best shows a logical CONTRAST?",
      o: ["Furthermore", "Therefore", "Nevertheless", "Consequently"],
      a: 2,
    },
    {
      id: 'ag6', type: 'standalone', area: 'grammar', level: 'advanced', difficulty: 3,
      q: "What is the function of a hedging language such as 'it could be argued that'?",
      o: [
        "to state a fact with certainty",
        "to indicate the author's definitive opinion",
        "to present an idea cautiously without full commitment",
        "to reject an opposing viewpoint",
      ],
      a: 2,
    },
    {
      id: 'ag7', type: 'standalone', area: 'grammar', level: 'advanced', difficulty: 3,
      q: "Which sentence contains an embedded clause used as a subject?",
      o: [
        "The results were surprising.",
        "What the researchers discovered changed the field.",
        "She studied hard, but the exam was difficult.",
        "The study, which took three years, was finally published.",
      ],
      a: 1,
    },
  ],

  passages: {
    short: {
      id: 'ap_short', type: 'passage', level: 'advanced', size: 'short',
      title: 'The Limits of Artificial Intelligence',
      genre: 'argumentative',
      passage: `Proponents of artificial intelligence often claim that AI will soon surpass human intelligence in every domain. However, this view oversimplifies the nature of intelligence itself. While AI systems excel at pattern recognition and data processing, they lack genuine understanding, creativity, and emotional awareness. Current AI models are fundamentally statistical tools — sophisticated, certainly, but incapable of the kind of contextual reasoning that defines human thought. Rather than fearing a robot uprising, we should focus on the more immediate concern: our growing dependence on systems we do not fully understand.`,
      questions: [
        {
          id: 'ap_s1', skill: 'author_purpose',
          q: "What is the author's primary purpose in this passage?",
          o: [
            "to celebrate the achievements of artificial intelligence",
            "to challenge overly optimistic views of AI capabilities",
            "to warn that robots will replace all human workers",
            "to explain how AI systems process data",
          ],
          a: 1,
        },
        {
          id: 'ap_s2', skill: 'argument',
          q: "What is the author's main concern about AI?",
          o: [
            "AI will become more intelligent than humans very soon.",
            "People are becoming too dependent on systems they don't understand.",
            "AI cannot process large amounts of data efficiently.",
            "AI lacks the ability to recognize patterns.",
          ],
          a: 1,
        },
        {
          id: 'ap_s3', skill: 'vocabulary_in_context',
          q: "In the passage, 'surpass' most nearly means ___.",
          o: ["fall behind", "go beyond", "work alongside", "be equal to"],
          a: 1,
        },
      ],
    },

    medium: {
      id: 'ap_medium', type: 'passage', level: 'advanced', size: 'medium',
      title: 'Urban Heat Islands',
      genre: 'informational',
      passage: `Metropolitan areas across the globe are experiencing a phenomenon known as the urban heat island effect — a condition in which cities are measurably warmer than the surrounding rural areas. This temperature disparity, which can range from 1 to 7 degrees Celsius, arises from a combination of factors specific to urban environments.

The primary driver is the replacement of natural vegetation with heat-absorbing surfaces such as asphalt and concrete. Unlike soil and plants, which release moisture through evaporation and transpiration, impervious surfaces trap and re-radiate heat. Additionally, urban areas generate significant amounts of waste heat from vehicles, air conditioning systems, and industrial activity.

The consequences are far-reaching. Higher ambient temperatures increase energy consumption as residents run air conditioning longer, creating a feedback loop that generates more heat. Public health experts have linked prolonged heat exposure to increased rates of heat stroke, cardiovascular stress, and respiratory illness — disproportionately affecting elderly populations and those in lower-income neighborhoods with fewer trees and parks.

Mitigation strategies include urban greening initiatives, the installation of cool or reflective roofs, and the creation of permeable pavement systems that allow water to be absorbed into the ground rather than running off into drainage systems.`,
      questions: [
        {
          id: 'ap_m1', skill: 'main_idea',
          q: "What is the central topic of this passage?",
          o: [
            "why cities should plant more trees",
            "the causes, consequences, and solutions of the urban heat island effect",
            "how air conditioning contributes to climate change",
            "the difference between rural and urban temperatures",
          ],
          a: 1,
        },
        {
          id: 'ap_m2', skill: 'cause_effect',
          q: "What creates the 'feedback loop' mentioned in the passage?",
          o: [
            "more trees absorb more carbon dioxide",
            "higher temperatures lead to more air conditioning, which generates more heat",
            "reflective roofs reduce cooling costs",
            "permeable pavement absorbs rainwater",
          ],
          a: 1,
        },
        {
          id: 'ap_m3', skill: 'vocabulary_in_context',
          q: "In the passage, 'impervious surfaces' refers to ___.",
          o: [
            "surfaces that absorb water easily",
            "surfaces that do not allow water to pass through",
            "surfaces covered with vegetation",
            "surfaces that reflect sunlight",
          ],
          a: 1,
        },
        {
          id: 'ap_m4', skill: 'inference',
          q: "Why does the author specifically mention 'lower-income neighborhoods'?",
          o: [
            "to argue that only poor people are affected by heat",
            "to suggest that the health impacts of heat islands are not distributed equally",
            "to show that income determines how much energy people use",
            "to explain why urban greening is expensive",
          ],
          a: 1,
        },
        {
          id: 'ap_m5', skill: 'evidence',
          q: "Which piece of evidence best supports the idea that urban heat islands have health consequences?",
          o: [
            "Cities can be 1 to 7 degrees Celsius warmer than rural areas.",
            "Asphalt and concrete absorb more heat than vegetation.",
            "Heat exposure is linked to heat stroke and cardiovascular stress.",
            "Permeable pavement allows water to be absorbed into the ground.",
          ],
          a: 2,
        },
      ],
    },

    long: {
      id: 'ap_long', type: 'passage', level: 'advanced', size: 'long',
      title: 'Should Governments Regulate Social Media Platforms?',
      genre: 'argumentative',
      passage: `The past decade has witnessed the extraordinary rise of social media platforms — entities that now shape public discourse, political opinion, and cultural identity on an unprecedented scale. As these platforms have grown, so too have concerns about their societal impact. The question of whether governments should regulate social media has become one of the defining policy debates of our era.

Advocates for regulation argue that current platforms operate in a regulatory vacuum that enables serious harms. Research has documented links between algorithmic amplification of outrage-inducing content and political polarization. In 2021, internal Facebook documents revealed that the company's own researchers had identified serious mental health risks for teenage users — risks the company allegedly chose to minimize for commercial reasons. Proponents argue that just as governments regulate food safety and pharmaceutical drugs, they have an obligation to regulate digital products that demonstrably harm public wellbeing.

Critics of regulation, however, raise compelling counter-arguments. Freedom of expression is a foundational democratic value, and government oversight of online speech risks crossing into censorship. History offers sobering examples of governments using regulatory powers to suppress political opposition under the guise of protecting citizens. Moreover, regulatory capture — wherein the entities being regulated gain undue influence over their own regulation — poses a real threat when powerful tech companies employ thousands of former government officials.

There is also the practical challenge of global jurisdiction. Social media platforms operate across borders, meaning that national regulations can be easily circumvented or simply push users toward less regulated alternatives.

A more nuanced approach may lie in targeted interventions rather than broad content regulation: mandating algorithmic transparency so researchers can audit platforms independently, requiring platforms to give users meaningful control over their algorithmic feeds, and establishing independent oversight bodies with genuine enforcement power. Such measures address structural problems without positioning governments as arbiters of truth.

The stakes could not be higher. As social media's influence on democracy, mental health, and social cohesion continues to grow, the question is not whether regulation is needed, but what kind of regulation can effectively protect public interests while preserving the open exchange of ideas that makes democratic society possible.`,
      questions: [
        {
          id: 'ap_l1', skill: 'main_idea',
          q: "What is the central question this passage addresses?",
          o: [
            "whether social media is more harmful than television",
            "whether governments should regulate social media platforms",
            "how social media algorithms amplify political content",
            "whether Facebook knowingly harmed teenage users",
          ],
          a: 1,
        },
        {
          id: 'ap_l2', skill: 'argument',
          q: "What is the main argument of those who SUPPORT social media regulation?",
          o: [
            "Social media companies are too large to be regulated.",
            "Platforms cause documented harms and governments have an obligation to address them.",
            "Free speech is less important than social media safety.",
            "Regulation would improve advertising on these platforms.",
          ],
          a: 1,
        },
        {
          id: 'ap_l3', skill: 'evidence',
          q: "What evidence does the author use to support the case for regulation?",
          o: [
            "surveys of teenagers about their social media use",
            "Facebook's internal research showing known mental health risks",
            "studies comparing regulated and unregulated platforms",
            "examples of countries that successfully banned social media",
          ],
          a: 1,
        },
        {
          id: 'ap_l4', skill: 'vocabulary_in_context',
          q: "In the passage, 'regulatory capture' refers to ___.",
          o: [
            "when governments successfully control powerful companies",
            "when regulated companies gain undue influence over their own regulation",
            "when regulations are too strict to be effective",
            "when international regulations replace national laws",
          ],
          a: 1,
        },
        {
          id: 'ap_l5', skill: 'inference',
          q: "Why does the author mention that tech companies 'employ thousands of former government officials'?",
          o: [
            "to show that tech jobs are desirable careers",
            "to suggest that these companies have too much influence over regulators",
            "to argue that government officials are qualified to work in tech",
            "to explain why tech companies understand regulation",
          ],
          a: 1,
        },
        {
          id: 'ap_l6', skill: 'author_purpose',
          q: "What does the author's proposed 'nuanced approach' suggest about their overall position?",
          o: [
            "they believe social media should not be regulated at all",
            "they support broad government control of online speech",
            "they favor targeted, structural regulation over broad content control",
            "they think the problem cannot be solved by any form of regulation",
          ],
          a: 2,
        },
        {
          id: 'ap_l7', skill: 'argument',
          q: "Which of the following BEST represents a counter-argument presented in the passage?",
          o: [
            "Social media platforms cause mental health problems.",
            "Government regulation could lead to censorship and suppress political opposition.",
            "Algorithmic transparency would help researchers understand platforms better.",
            "Social media shapes political opinion on a large scale.",
          ],
          a: 1,
        },
      ],
    },
  },
};
