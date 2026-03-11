# import cv2
# import numpy as np
# import mediapipe as mp
# import collections
# from tensorflow.keras.models import load_model
# from collections import deque
# import os
# import base64
# from flask import Flask
# from flask_socketio import SocketIO, emit

# # --- 1. SETUP ---
# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")

# print("Loading 104-Word BiLSTM Brain...")
# actions = np.load('classes.npy')
# model = load_model('action.h5')
# print(f"Brain Loaded! Ready for Meeting with {len(actions)} words.")

# mp_holistic = mp.solutions.holistic
# holistic = mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# # --- 2. ARCHITECTURE BUFFERS ---
# frame_buffer = deque(maxlen=30)        
# prediction_buffer = deque(maxlen=10)   
# sentence = []
# CONFIDENCE_THRESHOLD = 0.65  

# is_processing = False

# def extract_keypoints(results):
#     if results.pose_landmarks:
#         nose_x = results.pose_landmarks.landmark[0].x
#         nose_y = results.pose_landmarks.landmark[0].y
#         nose_z = results.pose_landmarks.landmark[0].z
#     else:
#         nose_x, nose_y, nose_z = 0, 0, 0

#     pose = np.array([[res.x - nose_x, res.y - nose_y, res.z - nose_z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
#     lh = np.array([[res.x - nose_x, res.y - nose_y, res.z - nose_z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
#     rh = np.array([[res.x - nose_x, res.y - nose_y, res.z - nose_z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
#     return np.concatenate([pose, lh, rh])

# # --- 3. THE WEBSOCKET RECEIVER ---
# @socketio.on('video_frame')
# def handle_frame(data):
#     global sentence, is_processing
    
#     if is_processing: return 
#     is_processing = True 
    
#     try:
#         if ',' not in data: return 
            
#         encoded_data = data.split(',')[1]
#         nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
#         frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#         if frame is None: return 

#         image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         image.flags.writeable = False
#         results = holistic.process(image)

#         hands_visible = bool(results.left_hand_landmarks or results.right_hand_landmarks)

#         if hands_visible:
#             keypoints = extract_keypoints(results)
#             frame_buffer.append(keypoints)

#             if len(frame_buffer) == 30:
#                 sequence_30 = np.array(frame_buffer)
#                 res = model.predict(np.expand_dims(sequence_30, axis=0), verbose=0)[0]
#                 best_guess = np.argmax(res)
                
#                 if res[best_guess] > CONFIDENCE_THRESHOLD:
#                     prediction_buffer.append(best_guess)
#                 else:
#                     prediction_buffer.append(-1) 

#                 if len(prediction_buffer) == 10:
#                     counter = collections.Counter(prediction_buffer)
#                     most_common_pred, count = counter.most_common(1)[0]

#                     if most_common_pred != -1 and count >= 6:
#                         current_word = actions[most_common_pred]
                        
#                         if len(sentence) == 0 or current_word != sentence[-1]:
#                             sentence.append(current_word)
                            
#                             print(f">>> BROADCASTING WORD TO ROOM: {current_word} <<<")
                            
#                             # ---> THE FIX: ONLY EMIT THE EXACT WORD WHEN LOCKED IN <---
#                             emit('ai_subtitle', {'text': current_word.upper()})
                            
#                             prediction_buffer.clear()
#                             frame_buffer.clear() 
#         else:
#             if len(frame_buffer) > 0:
#                 frame_buffer.clear()
#                 prediction_buffer.clear()

#         if len(sentence) > 5:
#             sentence = sentence[-5:]
        
#     except Exception as e:
#         print(f"Backend Error: {e}")
#     finally:
#         is_processing = False

# if __name__ == '__main__':
#     print("Starting AI WebSocket Server on port 5000...")
#     socketio.run(app, host='0.0.0.0', port=5000)

import cv2
import numpy as np
import mediapipe as mp
import collections
from tensorflow.keras.models import load_model
from collections import deque
import os
import base64
from flask import Flask
from flask_socketio import SocketIO, emit

# --- 1. SETUP ---
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

print("Loading 104-Word BiLSTM Brain...")
actions = np.load('classes.npy')
model = load_model('action.h5')
print(f"Brain Loaded! Ready for Meeting with {len(actions)} words.")

mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5)

frame_buffer = deque(maxlen=30)        
prediction_buffer = deque(maxlen=10)   
sentence = []
CONFIDENCE_THRESHOLD = 0.65  

is_processing = False

def extract_keypoints(results):
    if results.pose_landmarks:
        nose_x = results.pose_landmarks.landmark[0].x
        nose_y = results.pose_landmarks.landmark[0].y
        nose_z = results.pose_landmarks.landmark[0].z
    else:
        nose_x, nose_y, nose_z = 0, 0, 0

    pose = np.array([[res.x - nose_x, res.y - nose_y, res.z - nose_z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    lh = np.array([[res.x - nose_x, res.y - nose_y, res.z - nose_z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[res.x - nose_x, res.y - nose_y, res.z - nose_z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, lh, rh])

# --- FIXED VELOCITY GATE ---
def is_actively_signing(frame_buffer):
    # Look at the ENTIRE 30-frame sequence, not just the last 10
    left_wrist_x = [frame[60] for frame in frame_buffer]
    left_wrist_y = [frame[61] for frame in frame_buffer]
    right_wrist_x = [frame[64] for frame in frame_buffer]
    right_wrist_y = [frame[65] for frame in frame_buffer]

    left_movement = (max(left_wrist_x) - min(left_wrist_x)) + (max(left_wrist_y) - min(left_wrist_y))
    right_movement = (max(right_wrist_x) - min(right_wrist_x)) + (max(right_wrist_y) - min(right_wrist_y))
    
    # If the total movement across all 30 frames is practically zero, they are resting
    if left_movement < 0.02 and right_movement < 0.02:
        return False
        
    return True

# --- 3. THE WEBSOCKET RECEIVER ---
@socketio.on('video_frame')
def handle_frame(data):
    global sentence, is_processing
    
    if is_processing: return 
    is_processing = True 
    
    try:
        if ',' not in data: return 
            
        encoded_data = data.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None: return 

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = holistic.process(image)

        hands_visible = bool(results.left_hand_landmarks or results.right_hand_landmarks)

        if hands_visible:
            keypoints = extract_keypoints(results)
            frame_buffer.append(keypoints)

            if len(frame_buffer) == 30:
                # ---> THE FIX <---
                if not is_actively_signing(frame_buffer):
                    print("Status: Hands resting. Waiting for gesture...")
                    # We no longer wipe the memory here! Just skip predicting this frame.
                else:
                    sequence_30 = np.array(frame_buffer)
                    res = model.predict(np.expand_dims(sequence_30, axis=0), verbose=0)[0]
                    best_guess = np.argmax(res)
                    
                    if res[best_guess] > CONFIDENCE_THRESHOLD:
                        prediction_buffer.append(best_guess)
                    else:
                        prediction_buffer.append(-1) 

                    if len(prediction_buffer) == 10:
                        counter = collections.Counter(prediction_buffer)
                        most_common_pred, count = counter.most_common(1)[0]

                        if most_common_pred != -1 and count >= 5: # Tuned down to 5 for slightly faster response
                            current_word = actions[most_common_pred]
                            
                            if len(sentence) == 0 or current_word != sentence[-1]:
                                sentence.append(current_word)
                                print(f">>> LOCKED IN WORD: {current_word} <<<")
                                emit('ai_subtitle', {'text': current_word.upper()})
                                
                                prediction_buffer.clear()
                                frame_buffer.clear() 
        else:
            if len(frame_buffer) > 0:
                frame_buffer.clear()
                prediction_buffer.clear()

        if len(sentence) > 5:
            sentence = sentence[-5:]
        
    except Exception as e:
        print(f"Backend Error: {e}")
    finally:
        is_processing = False

if __name__ == '__main__':
    print("Starting AI WebSocket Server on port 5000...")
    socketio.run(app, host='0.0.0.0', port=5000)