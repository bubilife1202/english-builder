using System;
using System.Collections.Generic;

namespace SpellCaster
{
    public enum SpellType { Attack, Defense, Utility }

    // Data class for Spells
    [Serializable]
    public class SpellData
    {
        public string id;
        public string keyword; // The magic word! (e.g., "FIRE")
        public SpellType type;
        public int power;
        public float cooldown;

        public SpellData(string id, string keyword, SpellType type, int power)
        {
            this.id = id;
            this.keyword = keyword.ToUpper(); // Case insensitive
            this.type = type;
            this.power = power;
            this.cooldown = 1.0f;
        }
    }

    /// <summary>
    /// Manages real-time combat logic based on voice commands.
    /// No turns, just action.
    /// </summary>
    public class BattleManager
    {
        private VoiceInputHandler voiceHandler;
        private Dictionary<string, SpellData> spellBook;

        // Game State
        private int enemyHp = 500;
        private bool isBattleActive = true;

        public BattleManager()
        {
            voiceHandler = new VoiceInputHandler();
            spellBook = new Dictionary<string, SpellData>();

            // Initialize Spellbook (The player's memory)
            RegisterSpell(new SpellData("s_01", "FIRE", SpellType.Attack, 50));
            RegisterSpell(new SpellData("s_02", "ICE", SpellType.Attack, 50));
            RegisterSpell(new SpellData("s_03", "HEAL", SpellType.Utility, -30)); // Negative damage = heal
            RegisterSpell(new SpellData("s_04", "SHIELD", SpellType.Defense, 0));

            // Subscribe to voice events
            voiceHandler.OnKeywordRecognized += CastSpell;

            Console.WriteLine("[Battle] Battle Started! A Giant Golem appears!");
            Console.WriteLine("[Battle] Shout 'FIRE', 'ICE', or 'HEAL'!");
        }

        private void RegisterSpell(SpellData spell)
        {
            // In a real game, use a Trie or efficient lookup for many words
            if (!spellBook.ContainsKey(spell.keyword))
            {
                spellBook.Add(spell.keyword, spell);
            }
        }

        /// <summary>
        /// This method is called IMMEDIATELY when the voice engine detects a keyword.
        /// </summary>
        public void CastSpell(string keyword)
        {
            if (!isBattleActive) return;

            keyword = keyword.ToUpper();

            if (spellBook.TryGetValue(keyword, out SpellData spell))
            {
                Console.WriteLine($"[Battle] Player shouts: \"{keyword}!\"");
                ProcessSpellEffect(spell);
            }
            else
            {
                // Unrecognized magic
                Console.WriteLine($"[Battle] Player shouts: \"{keyword}\"... but nothing happens.");
            }
        }

        private void ProcessSpellEffect(SpellData spell)
        {
            switch (spell.type)
            {
                case SpellType.Attack:
                    enemyHp -= spell.power;
                    Console.WriteLine($"[Effect] > BOOM! {spell.keyword} hits the enemy for {spell.power} damage!");
                    break;
                case SpellType.Utility: // Heal
                    Console.WriteLine($"[Effect] > Divine light surrounds you. Recovered {-spell.power} HP.");
                    break;
                case SpellType.Defense:
                    Console.WriteLine($"[Effect] > A magical barrier appears!");
                    break;
            }

            Console.WriteLine($"[Enemy] HP: {enemyHp}");

            if (enemyHp <= 0)
            {
                isBattleActive = false;
                Console.WriteLine("[Battle] VICTORY! The Golem crumbles.");
            }
        }

        // Method to simulate raw input from microphone (for testing)
        public void SimulateMicInput(string text)
        {
            voiceHandler.ProcessRawInput(text);
        }
    }
}
