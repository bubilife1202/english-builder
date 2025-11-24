using System;

namespace WonderWord
{
    /// <summary>
    /// Simulates the "MapleStory-style" Damage Number popping.
    /// In Unity, this would manage a pool of Canvas Text Mesh Pro objects.
    /// </summary>
    public class DamageSkinSystem
    {
        public void ShowDamage(int amount, bool isCritical)
        {
            string style = isCritical ? "**CRITICAL**" : "Normal";
            string size = isCritical ? "BIG FONT" : "Small Font";
            string color = isCritical ? "RED/ORANGE" : "Yellow";

            Console.WriteLine($"   [DMG SKIN] {amount} ({style})");
            Console.WriteLine($"   -> Visual: Popping up with {color} in {size}!");
        }
    }
}
