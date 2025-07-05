import sys
import json
import struct
import os
import subprocess

def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        sys.exit(0)
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def send_message(message):
    encoded = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('=I', len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()

def open_folder(path):
    if os.path.exists(path):
        subprocess.Popen(['explorer', path])
        return True
    return False

if __name__ == "__main__":
    msg = read_message()
    folder_path = msg.get("path")
    success = open_folder(folder_path)
    send_message({"status": "ok" if success else "error"})