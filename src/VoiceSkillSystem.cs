using System;
using System.Collections.Generic;

namespace WonderWord
{
    public class SkillData
    {
        public string skillName;
        public List<string> keywords;
        public float damagePercent;
        public string effectPrefabName;

        public SkillData(string name, List<string> keys, float dmg, string effect)
        {
            this.skillName = name;
            this.keywords = keys;
            this.damagePercent = dmg;
            this.effectPrefabName = effect;
        }
    }

    /// <summary>
    /// Maps Voice Keywords to Game Skills.
    /// Acts as the bridge between Microphone and Gameplay.
    /// </summary>
    public class VoiceSkillSystem
    {
        public event Action<SkillData> OnSkillTriggered;
        private List<SkillData> learnedSkills;

        public VoiceSkillSystem()
        {
            learnedSkills = new List<SkillData>();

            // Basic Skill: Attack
            learnedSkills.Add(new SkillData("Basic Attack", new List<string>{"ATTACK", "HIT", "SLASH"}, 1.0f, "SlashEffect"));

            // Magic Skill: Fireball
            learnedSkills.Add(new SkillData("Fireball", new List<string>{"FIRE", "BURN", "FLAME"}, 2.5f, "FireBallPrefab"));

            // Utility: Heal
            learnedSkills.Add(new SkillData("Heal", new List<string>{"HEAL", "RECOVER"}, 0.0f, "HolyLight"));

            // Ultimate: Meteor
            learnedSkills.Add(new SkillData("Meteor Strike", new List<string>{"METEOR", "DOOM"}, 5.0f, "GiantRock"));
        }

        public void ProcessVoiceInput(string spokenWord)
        {
            string cleanWord = spokenWord.Trim().ToUpper();

            // Find matching skill
            foreach (var skill in learnedSkills)
            {
                if (skill.keywords.Contains(cleanWord))
                {
                    OnSkillTriggered?.Invoke(skill);
                    return;
                }
            }

            Console.WriteLine($"[Voice] Unrecognized command: '{cleanWord}' (Fizzle)");
        }
    }
}
