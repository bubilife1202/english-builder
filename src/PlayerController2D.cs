using System;
using System.Collections.Generic;

namespace WonderWord
{
    /// <summary>
    /// Core Controller for a 2D Platformer Character.
    /// Handles Physics (Jump, Move) and Voice Actions.
    /// </summary>
    public class PlayerController2D
    {
        // Mock Unity Components
        public float moveSpeed = 5.0f;
        public float jumpForce = 10.0f;
        public bool isGrounded = true;

        // State
        public float currentVelocityX;
        public float currentVelocityY;

        // Systems
        private VoiceSkillSystem voiceSystem;
        private DamageSkinSystem damageSystem;

        public PlayerController2D()
        {
            Console.WriteLine("[Player] Spawned at Slime Forest.");

            // Link Systems
            voiceSystem = new VoiceSkillSystem();
            damageSystem = new DamageSkinSystem();

            // Subscribe to Voice Events
            voiceSystem.OnSkillTriggered += PerformSkillAction;
        }

        /// <summary>
        /// Called every frame (Update loop simulation).
        /// </summary>
        public void Update(float inputX, bool jumpPressed)
        {
            // 1. Horizontal Movement
            currentVelocityX = inputX * moveSpeed;
            if (inputX != 0)
            {
                // Console.WriteLine($"[Anim] Run (Dir: {inputX})");
            }

            // 2. Jumping
            if (jumpPressed && isGrounded)
            {
                currentVelocityY = jumpForce;
                isGrounded = false;
                Console.WriteLine("[Action] JUMP!");
            }

            // 3. Gravity Simulation
            if (!isGrounded)
            {
                currentVelocityY -= 9.8f * 0.02f; // simple gravity
            }

            // (Mock ground check landing)
            if (currentVelocityY < 0 && !isGrounded)
            {
                 // Landed logic would go here
            }
        }

        /// <summary>
        /// Callback when a voice command is recognized.
        /// </summary>
        private void PerformSkillAction(SkillData skill)
        {
            Console.WriteLine($"[Voice Combo] Casts: {skill.skillName} !!!");

            // Animation Trigger
            // anim.SetTrigger(skill.animTrigger);

            // Effect
            Console.WriteLine($"[Visual] Spawn Effect: {skill.effectPrefabName}");

            // Damage Logic (Area of Effect)
            // Foreach enemy in range...
            int damage = (int)(100 * skill.damagePercent);
            bool isCrit = new Random().Next(0, 2) == 0; // 50% chance crit

            damageSystem.ShowDamage(damage, isCrit);
        }

        // Wrapper for testing voice input externally
        public void SimulateVoiceInput(string word)
        {
            voiceSystem.ProcessVoiceInput(word);
        }
    }
}
