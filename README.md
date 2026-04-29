# They Live: Field Agent

**THEY LIVE: FIELD AGENT** is a Web AR prototype game where you use your mobile camera to scan individuals and determine if they are humans or alien infiltrators. 

## Origin of the Idea
Three sources melted in my mind to create this concept:
1. **They Live (1988)**: The core theme of hidden aliens amongst us and the need to use a special lens to see the truth.
2. **Terminator 2 (1991)**: The iconic bar scene with Arnold's POV system scanning a biker and generating a rapid, cold, functional readout.
3. **Instagram Trend (March 2026, Italy)**: A viral trend where a picture of a man is shown to another man asking "is he gay or straight". They are all straight, but bias makes the participants always answer "gay". This highlights how humans inherently project narratives onto partial data.

This game plays with that exact bias: The "Signal" provides you with bureaucratic, sometimes absurd data. You project meaning onto it to decide if they are an alien.

## How to Play
1. **Open the Game**: Access the game via a mobile device on the local network (HTTPS required for camera access).
2. **Scan**: Point your camera at a person (or a picture/video of a person). The system uses an on-device AI model to lock onto them.
3. **Deduce**: Read the generated HUD fields. Based on the clues (e.g. "43% HUMAN FLUENCY"), the Threat Confidence will rise or fall. If Threat Confidence is >= 50%, the subject is an ALIEN.
4. **Action**: 
   - Choose `[ NEUTRALIZE ]` for aliens.
   - Choose `[ SKIP ]` for civilians.
5. **Score**: You start with 100 points. Reach 200 points for promotion. Drop to 0 and you are terminated.

## Technical Details
- **Vision Model**: The app evaluates and uses `@tensorflow-models/body-segmentation` (MediaPipe SelfieSegmentation via TF.js WebGL backend). This creates a highly performant and accurate bounding mask over the detected person without collecting biometrics.
- **Privacy**: The AI runs 100% locally on the device browser. No images are ever sent to a server.
- **Audio/Haptics**: Uses the Web Audio API for procedural retro synth sounds (zero external assets) and `navigator.vibrate` for tactile feedback.

## Deployment
The app is fully containerized using `podman`/`docker`.
- **Development**: `docker-compose up -d --build` (Generates self-signed certs)
- **Production**: `docker-compose -f docker-compose.prod.yml up -d --build` (Uses external Let's Encrypt certs)
- **Tests**: A separate container executes Vitest unit testing with coverage reporting.
