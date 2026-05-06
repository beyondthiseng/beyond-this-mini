// src/data/questions/intermediate.ts
import type { QuestionSet } from '../../types/questions';

export const intermediateQuestions: QuestionSet = {
  level: 'intermediate',

  vocabulary: [
    {
      id: 'iv1', type: 'standalone', area: 'vocabulary', level: 'intermediate', difficulty: 1,
      q: "'Convince' means to ___.",
      o: ["force someone to do something", "make someone believe something", "ask someone a question", "stop someone from acting"],
      a: 1,
    },
    {
      id: 'iv2', type: 'standalone', area: 'vocabulary', level: 'intermediate', difficulty: 1,
      q: "The word 'abundant' means ___.",
      o: ["rare and hard to find", "available in large amounts", "old and worn out", "small and unimportant"],
      a: 1,
    },
    {
      id: 'iv3', type: 'standalone', area: 'vocabulary', level: 'intermediate', difficulty: 2,
      q: "'Reluctant' means ___.",
      o: ["eager and ready", "unwilling or hesitant", "confused and lost", "confident and sure"],
      a: 1,
    },
    {
      id: 'iv4', type: 'standalone', area: 'vocabulary', level: 'intermediate', difficulty: 2,
      q: "A 'controversial' topic is one that ___.",
      o: ["everyone agrees on", "people strongly disagree about", "is easy to understand", "has been solved"],
      a: 1,
    },
    {
      id: 'iv5', type: 'standalone', area: 'vocabulary', level: 'intermediate', difficulty: 2,
      q: "'Imply' is closest in meaning to ___.",
      o: ["state directly", "suggest indirectly", "argue strongly", "prove clearly"],
      a: 1,
    },
    {
      id: 'iv6', type: 'standalone', area: 'vocabulary', level: 'intermediate', difficulty: 3,
      q: "Something 'inevitable' is ___.",
      o: ["possible but unlikely", "certain to happen", "easy to avoid", "hard to understand"],
      a: 1,
    },
    {
      id: 'iv7', type: 'standalone', area: 'vocabulary', level: 'intermediate', difficulty: 3,
      q: "'Objective' information is ___.",
      o: ["based on personal feelings", "based on facts, not opinions", "difficult to understand", "old and outdated"],
      a: 1,
    },
    {
      id: 'iv8', type: 'standalone', area: 'vocabulary', level: 'intermediate', difficulty: 3,
      q: "To 'exaggerate' means to ___.",
      o: ["tell the truth clearly", "make something seem bigger or better than it is", "explain something simply", "repeat something many times"],
      a: 1,
    },
  ],

  grammar: [
    {
      id: 'ig1', type: 'standalone', area: 'grammar', level: 'intermediate', difficulty: 1,
      q: "The report ___ by the team before the deadline.",
      o: ["was completed", "completed", "has completed", "is completing"],
      a: 0,
    },
    {
      id: 'ig2', type: 'standalone', area: 'grammar', level: 'intermediate', difficulty: 1,
      q: "Which sentence uses the correct relative clause?",
      o: [
        "The book which I borrowed it was interesting.",
        "The book that I borrowed was interesting.",
        "The book whom I borrowed was interesting.",
        "The book I borrowed it was interesting.",
      ],
      a: 1,
    },
    {
      id: 'ig3', type: 'standalone', area: 'grammar', level: 'intermediate', difficulty: 2,
      q: "Not only did she finish the project, ___ she also helped her classmates.",
      o: ["and", "but", "so", "or"],
      a: 1,
    },
    {
      id: 'ig4', type: 'standalone', area: 'grammar', level: 'intermediate', difficulty: 2,
      q: "The data ___ collected over three years before the study was published.",
      o: ["was", "were", "has been", "is"],
      a: 1,
    },
    {
      id: 'ig5', type: 'standalone', area: 'grammar', level: 'intermediate', difficulty: 2,
      q: "Identify the topic sentence: 'Ocean pollution is a serious global problem. Plastic waste kills marine life. Oil spills damage coastlines. Chemical runoff poisons fish.'",
      o: [
        "Plastic waste kills marine life.",
        "Ocean pollution is a serious global problem.",
        "Oil spills damage coastlines.",
        "Chemical runoff poisons fish.",
      ],
      a: 1,
    },
    {
      id: 'ig6', type: 'standalone', area: 'grammar', level: 'intermediate', difficulty: 3,
      q: "Which sentence shows cause and effect?",
      o: [
        "She likes coffee and tea.",
        "Because of heavy rain, the game was cancelled.",
        "He is tall, but she is short.",
        "First, we ate dinner. Then, we watched a movie.",
      ],
      a: 1,
    },
    {
      id: 'ig7', type: 'standalone', area: 'grammar', level: 'intermediate', difficulty: 3,
      q: "Which sentence is in the subjunctive mood?",
      o: [
        "She works hard every day.",
        "If I were you, I would apologize.",
        "He has already finished his homework.",
        "They are going to the library.",
      ],
      a: 1,
    },
  ],

  passages: {
    short: {
      id: 'ip_short', type: 'passage', level: 'intermediate', size: 'short',
      title: 'Social Media and Mental Health',
      genre: 'informational',
      passage: `Research shows a link between heavy social media use and increased levels of anxiety and depression, particularly among teenagers. Studies suggest that comparing oneself to others online can lead to lower self-esteem. However, some experts argue that social media can also provide support networks and reduce loneliness. The key may lie in how social media is used, rather than how much time is spent on it.`,
      questions: [
        {
          id: 'ip_s1', skill: 'main_idea',
          q: "What is the main idea of this passage?",
          o: [
            "Social media causes depression in all users.",
            "Teenagers should not use social media.",
            "The relationship between social media and mental health is complex.",
            "Experts agree that social media is harmful.",
          ],
          a: 2,
        },
        {
          id: 'ip_s2', skill: 'cause_effect',
          q: "According to the passage, what can cause lower self-esteem?",
          o: ["spending too much time online", "comparing oneself to others online", "using social media for support", "reading research studies"],
          a: 1,
        },
        {
          id: 'ip_s3', skill: 'fact_opinion',
          q: "Which statement from the passage is a FACT supported by research?",
          o: [
            "Social media is always harmful to teenagers.",
            "People should limit their social media use.",
            "There is a link between heavy social media use and anxiety.",
            "Social media provides the best support networks.",
          ],
          a: 2,
        },
      ],
    },

    medium: {
      id: 'ip_medium', type: 'passage', level: 'intermediate', size: 'medium',
      title: 'The Columbian Exchange',
      genre: 'informational',
      passage: `When Christopher Columbus arrived in the Americas in 1492, he began a massive exchange of plants, animals, and diseases between the Old World and the New World. Historians call this the Columbian Exchange.

From the Americas, Europeans brought back tomatoes, potatoes, corn, and chocolate. These crops transformed European diets and eventually helped populations grow. Potatoes alone became a staple food for millions in Europe.

However, the Columbian Exchange had a devastating downside. Europeans brought diseases such as smallpox, measles, and influenza to the Americas. Indigenous people had no immunity to these illnesses. As a result, millions of Native Americans died — some historians estimate that up to 90% of the indigenous population perished within a century of contact.

The Columbian Exchange reminds us that even well-intentioned connections between cultures can have deeply unequal consequences.`,
      questions: [
        {
          id: 'ip_m1', skill: 'main_idea',
          q: "What is the Columbian Exchange?",
          o: [
            "Christopher Columbus's journey to Asia",
            "the exchange of plants, animals, and diseases between the Old and New Worlds",
            "a trade agreement between Spain and America",
            "the spread of European culture to the Americas",
          ],
          a: 1,
        },
        {
          id: 'ip_m2', skill: 'cause_effect',
          q: "Why did so many Native Americans die after European contact?",
          o: [
            "They did not have enough food.",
            "They had no immunity to European diseases.",
            "They were forced to work on farms.",
            "They moved to different regions.",
          ],
          a: 1,
        },
        {
          id: 'ip_m3', skill: 'vocabulary_in_context',
          q: "In the passage, 'devastating' means ___.",
          o: ["slightly inconvenient", "causing great damage", "completely positive", "somewhat surprising"],
          a: 1,
        },
        {
          id: 'ip_m4', skill: 'inference',
          q: "What can we infer from the last paragraph?",
          o: [
            "Columbus intended to harm indigenous people.",
            "Cultural exchanges always lead to equal benefits.",
            "Historical events can have both positive and negative consequences.",
            "European diseases were not that serious.",
          ],
          a: 2,
        },
        {
          id: 'ip_m5', skill: 'detail',
          q: "Which of the following did Europeans bring FROM the Americas?",
          o: ["wheat and rice", "horses and cattle", "tomatoes and potatoes", "smallpox and measles"],
          a: 2,
        },
      ],
    },

    long: {
      id: 'ip_long', type: 'passage', level: 'intermediate', size: 'long',
      title: 'Is Homework Helpful or Harmful?',
      genre: 'argumentative',
      passage: `For decades, homework has been a standard part of education. However, researchers, parents, and educators are increasingly debating whether homework actually benefits students.

Those who support homework argue that it reinforces what students learn in class. Practicing at home helps students remember information better. Homework also teaches important life skills such as time management, responsibility, and independent thinking. Research by Duke University professor Harris Cooper suggests that homework is beneficial for middle and high school students, though the benefits are less clear for younger children.

On the other hand, critics point out that too much homework can be harmful. A study from Stanford University found that high school students who spent more than three hours on homework per night reported higher levels of stress and health problems. Furthermore, homework can deepen educational inequality. Students with more resources at home — computers, quiet study spaces, and educated parents — have significant advantages over those without.

Some education systems have taken note. Countries like Finland assign very little homework and consistently rank among the top in global education assessments. This suggests that academic success does not require large amounts of homework.

The research suggests a nuanced conclusion: a moderate amount of homework is beneficial for older students, but excessive homework can be counterproductive. Rather than eliminating homework entirely, educators should focus on assigning meaningful, purposeful tasks that support learning without overwhelming students.`,
      questions: [
        {
          id: 'ip_l1', skill: 'main_idea',
          q: "What is the main argument of this passage?",
          o: [
            "Homework should be completely eliminated.",
            "All students benefit equally from homework.",
            "The effects of homework are complex and depend on amount and purpose.",
            "Finland has the best education system in the world.",
          ],
          a: 2,
        },
        {
          id: 'ip_l2', skill: 'detail',
          q: "According to Professor Harris Cooper's research, homework is most beneficial for ___.",
          o: ["all students equally", "elementary school students", "middle and high school students", "students with educated parents"],
          a: 2,
        },
        {
          id: 'ip_l3', skill: 'cause_effect',
          q: "According to the Stanford study, what happens when students do more than 3 hours of homework?",
          o: ["they perform better on tests", "they experience higher stress", "they develop better time management", "they learn more vocabulary"],
          a: 1,
        },
        {
          id: 'ip_l4', skill: 'vocabulary_in_context',
          q: "In the passage, 'counterproductive' means ___.",
          o: ["producing good results", "producing opposite of intended results", "producing average results", "producing surprising results"],
          a: 1,
        },
        {
          id: 'ip_l5', skill: 'inference',
          q: "Why does the author mention Finland?",
          o: [
            "to argue that all countries should copy Finland",
            "to show that success is possible without heavy homework",
            "to prove that homework has no value",
            "to explain why European schools are better",
          ],
          a: 1,
        },
        {
          id: 'ip_l6', skill: 'fact_opinion',
          q: "Which of the following is an OPINION expressed in the passage?",
          o: [
            "A Stanford study found higher stress levels with excessive homework.",
            "Finland consistently ranks among the top in global education assessments.",
            "Educators should focus on meaningful, purposeful homework tasks.",
            "Harris Cooper is a professor at Duke University.",
          ],
          a: 2,
        },
        {
          id: 'ip_l7', skill: 'argument',
          q: "What is the author's final recommendation regarding homework?",
          o: [
            "eliminate homework completely",
            "increase homework for all students",
            "assign moderate, meaningful homework for older students",
            "follow Finland's education system exactly",
          ],
          a: 2,
        },
      ],
    },
  },
};
