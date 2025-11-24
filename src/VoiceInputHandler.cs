using System;

namespace SpellCaster
{
    /// <summary>
    /// Simulates the OS-level Speech Recognition Engine.
    /// In a real app, this wraps Android SpeechRecognizer / iOS Speech Framework.
    /// </summary>
    public class VoiceInputHandler
    {
        // Event triggered when a keyword is spotted
        public event Action<string> OnKeywordRecognized;

        public VoiceInputHandler()
        {
            Console.WriteLine("[System] Voice Engine (KWS) Initialized.");
        }

        /// <summary>
        /// Simulates receiving partial results from the microphone.
        /// In reality, this runs every 100ms as the user speaks.
        /// </summary>
        public void ProcessRawInput(string spokenText)
        {
            if (string.IsNullOrEmpty(spokenText)) return;

            string cleaned = spokenText.Trim().ToUpper();

            // KWS Logic: Check if the spoken text MATCHES any known command.
            // In a real KWS, we might check if the stream *contains* the keyword.

            // For this prototype, we assume the input is the word itself.
            OnKeywordRecognized?.Invoke(cleaned);
        }
    }
}
