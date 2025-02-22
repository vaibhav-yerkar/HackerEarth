from gtts import gTTS
import io
import pygame
from translate import Translator

class TextToAudio:
    def __init__(self):
        # Initialize pygame mixer
        pygame.mixer.init()

    def text_to_audio(self, text, lang="en"):
        """
        Converts text to an audio file in memory using gTTS.
        :param text: Text to convert to audio.
        :param lang: Language code for the audio (default is English).
        :return: BytesIO object containing the audio data.
        """
        try:
            # Create a gTTS object
            tts = gTTS(text=text, lang=lang)

            # Save the audio to a file-like object
            audio_data = io.BytesIO()
            tts.write_to_fp(audio_data)

            # Reset the pointer to the start of the file
            audio_data.seek(0)

            print("Audio generated successfully.")
            return audio_data
        except Exception as e:
            print(f"An error occurred while generating audio: {e}")
            return None

    def play_audio_from_bytesio(self, audio_file):
        """
        Plays an audio file from a BytesIO object using pygame.
        :param audio_file: BytesIO object containing audio data.
        """
        try:
            # Ensure BytesIO is at the start
            audio_file.seek(0)

            # Load the audio file from BytesIO
            pygame.mixer.music.load(audio_file, "mp3")

            # Play the audio
            pygame.mixer.music.play()
            print("Playing audio...")

            # Keep the script running while the audio is playing
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
        except Exception as e:
            print(f"An error occurred while playing audio: {e}")

class TranslatorHelper:
    def english_to_hindi(self, text):
        """
        Translates English text to Hindi.
        :param text: English text to translate.
        :return: Translated Hindi text.
        """
        try:
            translator = Translator(to_lang="hi")
            return translator.translate(text)
        except Exception as e:
            print(f"An error occurred while translating text: {e}")
            return text

class AudioGenerator:
    def __init__(self):
        self.text_to_audio_helper = TextToAudio()
        self.translator_helper = TranslatorHelper()

    def generate_audio(self, text, lang="en"):
        """
        Generates audio for given text in the specified language.
        If the language is Hindi, it translates the text before generating audio.
        :param text: Text to convert to audio.
        :param lang: Language code (e.g., 'en' for English, 'hi' for Hindi).
        :return: BytesIO object containing audio data.
        """
        if lang == "hi":
            text = self.translator_helper.english_to_hindi(text)
        return self.text_to_audio_helper.text_to_audio(text, lang=lang)

# # Example usage
# if __name__ == "__main__":
#     generator = AudioGenerator()
#     audio = generator.generate_audio("Hello, how are you?", lang="hi")
#     if audio:
#         generator.text_to_audio_helper.play_audio_from_bytesio(audio)

