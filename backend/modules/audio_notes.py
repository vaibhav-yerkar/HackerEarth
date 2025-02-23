import io
import os

import pygame
from gtts import gTTS
from translate import Translator


class AudioNotes:
    def __init__(self):
        """Initialize pygame mixer for audio playback."""
        os.environ["SDL_AUDIODRIVER"] = "dummy"
        pygame.mixer.init()
        self.translator = Translator(to_lang="hi")

    def text_to_audio(self, text: str, lang: str = "en") -> io.BytesIO:
        """
        Converts text to an audio file in memory using gTTS.
        :param text: Text to convert to audio.
        :param lang: Language code for the audio (default is English).
        :return: BytesIO object containing the audio data.
        """
        try:
            # If Hindi is selected, translate text before generating audio
            if lang == "hi":
                text = self.english_to_hindi(text)

            tts = gTTS(text=text, lang=lang)
            audio_data = io.BytesIO()
            tts.write_to_fp(audio_data)
            audio_data.seek(0)

            print("Audio generated successfully.")
            return audio_data
        except Exception as e:
            print(f"An error occurred while generating audio: {e}")
            return None

    def play_audio(self, audio_file: io.BytesIO):
        """
        Plays an audio file from a BytesIO object using pygame.
        :param audio_file: BytesIO object containing audio data.
        """
        try:
            audio_file.seek(0)
            pygame.mixer.music.load(audio_file, "mp3")
            pygame.mixer.music.play()
            print("Playing audio...")

            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
        except Exception as e:
            print(f"An error occurred while playing audio: {e}")

    def english_to_hindi(self, text: str) -> str:
        """
        Translates English text to Hindi.
        :param text: English text to translate.
        :return: Translated Hindi text.
        """
        try:
            return self.translator.translate(text)
        except Exception as e:
            print(f"An error occurred while translating text: {e}")
            return text  # Return original text if translation fails
