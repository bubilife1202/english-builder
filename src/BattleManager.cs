using System;
using System.Collections.Generic;
using System.Text;

namespace GrammarGuardian
{
    // Enums for Word Types
    public enum WordType { Noun, Verb, Adjective, Preposition, Pronoun }

    // Data Class for Word Cards
    [Serializable]
    public class WordCard
    {
        public int id;
        public string text;
        public WordType type;
        public int manaCost;
        public int power;

        public WordCard(int id, string text, WordType type, int cost, int power)
        {
            this.id = id;
            this.text = text;
            this.type = type;
            this.manaCost = cost;
            this.power = power;
        }
    }

    /// <summary>
    /// Manages the Turn-Based Battle Logic.
    /// Incorporates the "Sentence = Skill" mechanic.
    /// </summary>
    public class BattleManager
    {
        private LocalNLPManager nlpManager;
        private List<WordCard> playerHand;
        private int playerMana;

        // Mock Enemy State
        private int enemyHp = 100;

        public BattleManager()
        {
            nlpManager = new LocalNLPManager();
            playerHand = new List<WordCard>();
            playerMana = 10;

            // Initial Draw
            DrawCard(new WordCard(1, "I", WordType.Pronoun, 1, 0));
            DrawCard(new WordCard(2, "Attack", WordType.Verb, 3, 20));
            DrawCard(new WordCard(3, "The", WordType.Adjective, 1, 0)); // Article treated as Adj for simplification
            DrawCard(new WordCard(4, "Monster", WordType.Noun, 2, 5));
        }

        public void DrawCard(WordCard card)
        {
            playerHand.Add(card);
            Console.WriteLine($"[Battle] Drew card: [{card.text}]");
        }

        /// <summary>
        /// Player attempts to cast a spell by forming a sentence.
        /// </summary>
        /// <param name="selectedCardIndices">Indices of cards in hand to combine</param>
        public void CastSentenceSkill(List<int> selectedCardIndices)
        {
            List<WordCard> sentenceChain = new List<WordCard>();
            StringBuilder sentenceBuilder = new StringBuilder();
            int totalCost = 0;
            int totalPower = 0;

            foreach (int index in selectedCardIndices)
            {
                if (index < 0 || index >= playerHand.Count) continue;

                WordCard card = playerHand[index];
                sentenceChain.Add(card);
                sentenceBuilder.Append(card.text).Append(" ");
                totalCost += card.manaCost;
                totalPower += card.power;
            }

            string fullSentence = sentenceBuilder.ToString().Trim();
            Console.WriteLine($"[Battle] Casting: \"{fullSentence}\"");

            // 1. Check Mana
            if (playerMana < totalCost)
            {
                Console.WriteLine("[Battle] Not enough Mana!");
                return;
            }

            // 2. Validate Grammar (Local NLP)
            bool isValid = nlpManager.ValidateSentence(sentenceChain);

            if (isValid)
            {
                // Critical Hit if grammar is perfect
                float damageMultiplier = 1.5f;
                int finalDamage = (int)(totalPower * damageMultiplier);

                enemyHp -= finalDamage;
                playerMana -= totalCost;

                Console.WriteLine($"[Battle] Success! The spell hits purely! Dealt {finalDamage} damage.");
                Console.WriteLine($"[Battle] Enemy HP: {enemyHp}");
            }
            else
            {
                // Fizzle or weak attack
                int weakDamage = (int)(totalPower * 0.1f);
                enemyHp -= weakDamage;
                playerMana -= totalCost;

                Console.WriteLine("[Battle] The sentence is grammatically unstable... The spell fizzles.");
                Console.WriteLine($"[Battle] Dealt {weakDamage} damage.");
            }
        }
    }
}
