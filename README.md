# 🕶️ They Live: Field Agent

**THEY LIVE: FIELD AGENT** is a Web AR prototype game where you use your mobile camera to scan individuals and determine if they are humans or alien infiltrators. 👽

## 🧠 Origin of the Idea
Three sources melted in my mind to create this concept:
1. **[They Live (1988)](https://en.wikipedia.org/wiki/They_Live)**: The core theme of hidden aliens living among us, and the absolute necessity of using a special lens to see the truth.
2. **[Terminator 2: Judgment Day (1991)](https://en.wikipedia.org/wiki/Terminator_2:_Judgment_Day)**: The iconic bar scene featuring Arnold's POV system—scanning a biker and generating a rapid, cold, functional readout. 🤖
3. **Instagram Trend (March 2026, Italy)**: A viral trend where a picture of a man is shown to another man asking "is he gay or straight?". They are all straight, but bias makes the participants always answer "gay". This highlights how humans inherently project narratives onto partial data.

This game plays directly with that exact bias: The "Signal" provides you with bureaucratic, sometimes absurd data. You project meaning onto it to decide if the target is an alien. 🕵️‍♂️

## 🎮 How to Play
1. **Open the Game**: Access the game via your mobile device over the local network (HTTPS is required for camera access).
2. **Scan**: Point your camera at a person (or even a picture/video of a person). The system uses an on-device AI model to lock onto them. 📸
3. **Deduce**: Read the generated HUD fields. Based on the clues (e.g., *"43% HUMAN FLUENCY"*), the Threat Confidence will rise or fall. **Beware:** The percentage display has signal noise! If the true, underlying Threat Confidence is >= 50%, the subject is an ALIEN.
4. **Action**: 
   - Choose `[ NEUTRALIZE ]` for aliens. 🔫
   - Choose `[ SKIP ]` for civilians. 🚶
5. **Score**: You start with 100 points. Reach 200 points for a promotion. Drop to 0 and you are terminated. 💀

## ⚙️ Technical Details
- **Vision Model**: The app utilizes `@tensorflow-models/coco-ssd` running via the TF.js WebGL backend. It generates a highly performant object detection lock mapped dynamically to the subject with a custom, retro-futuristic AR bracket UI. 🟢
- **Privacy**: The AI runs 100% locally in the device's browser. Absolutely no images or data are ever sent to a server. 🔒
- **Audio & Haptics**: Uses the native Web Audio API for procedural retro synth sounds (zero external assets!) and `navigator.vibrate` for tactile physical feedback. 🔊

## 🚀 Deployment (Podman)
The application is fully containerized and designed to run using `podman`.

- **Development Mode**: 
  ```bash
  podman-compose up -d --build
  ```
  *(This automatically generates self-signed certificates so mobile devices can access the camera API).*

- **Production Mode (Reverse Proxy)**: 
  ```bash
  podman-compose -f docker-compose.prod.yml up -d --build
  ```
  *(Runs purely in user-space, exposing HTTP on port `8080`. You should delegate HTTPS Let's Encrypt termination to an external Nginx or Traefik reverse proxy).*

- **Testing**: 
  A separate container handles Vitest unit testing with coverage reporting:
  ```bash
  podman build -t they-live-test -f Dockerfile.test .
  podman run --rm they-live-test
  ```

## 🌐 Static Deployment (Surge, GitHub Pages, Vercel)
Because this project was engineered using pure Vanilla JS (ES Modules) and loads the TensorFlow.js models directly via CDN, **there is no build step required**. 

The `web_app/` directory *is* your distribution folder! 

To deploy to a service like [Surge.sh](https://surge.sh/), simply point it to the `web_app` directory:
```bash
npm install -g surge
surge --add
surge ./web_app raspy-agreement.surge.sh # Example domain
```
*(Note: Static hosts must enforce HTTPS, as browsers will strictly block camera access on HTTP).*
