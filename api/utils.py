import tiktoken
import subprocess
import os
from pydub import AudioSegment
import openai
from threading import Thread

def num_tokens_from_messages(messages, model="gpt-3.5-turbo-0301"):
  """Returns the number of tokens used by a list of messages."""
  try:
      encoding = tiktoken.encoding_for_model(model)
  except KeyError:
      encoding = tiktoken.get_encoding("cl100k_base")
  if model == "gpt-3.5-turbo-0301":  # note: future models may deviate from this
      num_tokens = 0
      for message in messages:
          num_tokens += 4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
          for key, value in message.items():
              num_tokens += len(encoding.encode(value))
              if key == "name":  # if there's a name, the role is omitted
                  num_tokens += -1  # role is always required and always 1 token
      num_tokens += 2  # every reply is primed with <im_start>assistant
      return num_tokens
  else:
      raise NotImplementedError(f"""num_tokens_from_messages() is not presently implemented for model {model}.
  See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.""")


DIVISIONS = 5
MIN_TIME_FOR_DIVISION = 6 * 60 # 10 minutes
MILISSECONDS = 1000

def convert_video_to_audio_ffmpeg(video_file, output_ext="mp3"):
    """Converts video to audio directly using `ffmpeg` command
    with the help of subprocess module"""
    filename, ext = os.path.splitext(video_file)
    subprocess.call(["ffmpeg", "-y", "-i", video_file, f"{filename}.{output_ext}"], 
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.STDOUT)
    
def split_audio_by_size(audiofile):
    audio_segment = AudioSegment.from_mp3(audiofile)
    audio_files = []

    total_time = audio_segment.duration_seconds
    if total_time < MIN_TIME_FOR_DIVISION:
        return [audiofile]
    
    division_time = total_time / DIVISIONS
    for i in range(DIVISIONS):
        print(f"Creating audio file {i} of {DIVISIONS}")
        t1 = (i * MILISSECONDS) * division_time 
        t2 = ((i + 1) * MILISSECONDS) * division_time

        if t2 > total_time * MILISSECONDS:
            t2 = total_time * MILISSECONDS

        newAudio = audio_segment[t1:t2]
        newAudioFilename = f"{audiofile.split('.')[0]}_{i}.mp3"
        newAudio.export(newAudioFilename, format="mp3") #Exports to a wav file in the current path.
        audio_files.append(newAudioFilename)

    return audio_files

def get_audio_files(video_file):
    """Returns list of audio files of size less than MAX_FILE_SIZE"""
    convert_video_to_audio_ffmpeg(video_file)
    audio_files = split_audio_by_size(f"{video_file.split('.')[0]}.mp3")
    return audio_files

def openai_transcribe(audio_name, transcriptions, index):
    audio = open(audio_name, "rb")
    transcription = openai.Audio.transcribe("whisper-1", audio)['text']
    audio.close()
    transcriptions[index] = transcription


def get_transcription(audios):
    threads = [None] * len(audios)
    transcriptions = [None] * len(audios)
    for i in range(len(audios)):
        threads[i] = Thread(target=openai_transcribe, args=(audios[i], transcriptions, i))
        threads[i].start()
    
    for i in range(len(audios)):
        threads[i].join()

    return " ".join(transcriptions)

def remove_id_from_messages(messages):
    for message in messages:
        if "id" in message:
            del message["id"]
    return messages

def limit_tokens(messages,  max_tokens=4096):
    num_tokens = num_tokens_from_messages(messages)
    if num_tokens <= max_tokens:
        return messages
    else:
        for i in range(len(messages)-1, -1, -1):
            new_messages = messages[:i] + messages[i+1:]
            if num_tokens_from_messages(new_messages) <= max_tokens:
                return limit_tokens(new_messages, num_tokens_from_messages, max_tokens)
        return []