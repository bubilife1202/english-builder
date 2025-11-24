using System;
using System.Collections.Generic;

namespace GrammarGuardian
{
    /// <summary>
    /// Simulates the On-Device AI engine.
    /// In a real Unity project, this would interface with TF-Lite or Unity Sentis.
    /// Here, we use a heuristic rule-based approach for the prototype.
    /// </summary>
    public class LocalNLPManager
    {
        public LocalNLPManager()
        {
            Console.WriteLine("[System] Local NLP Engine Initialized (Zero-Server Mode)");
        }

        /// <summary>
        /// Validates if the sequence of cards forms a grammatically correct sentence.
        /// </summary>
        public bool ValidateSentence(List<WordCard> sentenceChain)
        {
            if (sentenceChain == null || sentenceChain.Count == 0) return false;

            // Simple Heuristic Rule: SVO (Subject + Verb + Object)
            // Or simple SV (Subject + Verb)

            // Expected pattern: [Pronoun/Noun] + [Verb] + (Optional [Noun/Object])

            bool hasSubject = false;
            bool hasVerb = false;
            bool hasObject = false;

            // State Machine for basic grammar check
            int stage = 0; // 0: Expect Subject, 1: Expect Verb, 2: Expect Object/End

            foreach (var card in sentenceChain)
            {
                switch (stage)
                {
                    case 0: // Looking for Subject
                        if (card.type == WordType.Noun || card.type == WordType.Pronoun)
                        {
                            hasSubject = true;
                            stage = 1;
                        }
                        else if (card.type == WordType.Adjective)
                        {
                            // Adjectives can precede nouns, stay in stage 0
                        }
                        else
                        {
                            Console.WriteLine($"[NLP] Syntax Error: Expected Subject, found {card.type}");
                            return false;
                        }
                        break;

                    case 1: // Looking for Verb
                        if (card.type == WordType.Verb)
                        {
                            hasVerb = true;
                            stage = 2;
                        }
                        else
                        {
                            Console.WriteLine($"[NLP] Syntax Error: Expected Verb, found {card.type}");
                            return false;
                        }
                        break;

                    case 2: // Looking for Object (Optional)
                        if (card.type == WordType.Noun || card.type == WordType.Pronoun)
                        {
                            hasObject = true;
                        }
                        else if (card.type == WordType.Adjective || card.type == WordType.Preposition)
                        {
                            // Modifiers allowed
                        }
                        else
                        {
                             // Simple prototype allows mainly nouns/modifiers here
                        }
                        break;
                }
            }

            // Final Validation
            if (hasSubject && hasVerb)
            {
                return true;
            }

            Console.WriteLine("[NLP] Incomplete Sentence.");
            return false;
        }

        /// <summary>
        /// Simulates STT result processing (cleaning up text).
        /// </summary>
        public string ProcessVoiceInput(string rawText)
        {
            // In a real app, this would use local cleanup logic.
            return rawText.Trim().ToLower();
        }
    }
}
