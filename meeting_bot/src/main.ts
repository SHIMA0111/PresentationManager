// Currently, we experiment the Google Meet join automation.
// The latest Google Meet reject the access using StealsPlugin.
// You only need disabling the AutomationControlled. (This may be changed in future.)

import {Page, CDPSession} from "playwright";
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import {clearInterval} from "node:timers";
import { BrowserManager } from "./utils/browser/browser";

const MEET_URL = "https://meet.google.com/zax-hoek-rzr";
const RECORDING_DURATION_MS = 60000;
const VIDEO_PATH = "output.webm";
const AUDIO_PATH = "audio.wav";
let dismissTimeout: NodeJS.Timeout | null = null;

(async () => {
   const browserManager = new BrowserManager();
   await browserManager.createBrowser(false);

   console.log("Page creating by browser...");
   const page = await browserManager.gerOrCreatePage();

   if (!page) {
      console.error("Failed to create page!");
      return;
   }

   try {
      console.log("Navigating to page...");
      await page.goto(MEET_URL, {
         waitUntil: "networkidle",
         timeout: 30000,
      });

      console.log("Navigated to page!");

      console.log("Mute microphone and turn off camera...")
      await muteMicrophone(page);
      await muteCamera(page);

      await clickDismiss(page);
      await sleep(300);
      await inputBotName(page, "議事録");
      await sleep(300);
      await clickWithInnerText(page, 'button', ['Ask to join', 'Join now']);
      await sleep(300);
      await page.waitForSelector('button[aria-label="Leave call"]', {
         timeout: 600000,
      });

      dismissTimeout = setInterval(async () => {
         try {
            await clickWithInnerText(page, 'button', ['Got it']);
         } catch (error) {
            clearInterval(dismissTimeout!);
         }
      }, 1000);

      const cdpClient = await browserManager.getCDPClient();
      if (!cdpClient) {
         console.error("Failed to get CDP client!");
         return;
      }

      await startRecording(cdpClient);
      await startAudioRecording(page);

      console.log("Recording started!");
      await sendChatMessage(page, "Hi, everyone!\nI'm a bot to record the meeting!\nPlease don't mind me.");

      console.log(`${RECORDING_DURATION_MS / 1000} seconds recording started!`);
      // Use a more precise timer to ensure we record for the full duration
      const startTime = Date.now();
      const endTime = startTime + RECORDING_DURATION_MS;

      // Wait until the full recording duration has elapsed
      while (Date.now() < endTime) {
         await sleep(1000); // Check every second
         console.log(`Recording in progress... ${Math.round((Date.now() - startTime) / 1000)} seconds elapsed`);
      }

      console.log(`Recording completed after ${(Date.now() - startTime) / 1000} seconds`);

      // Stop audio recording first
      await stopAudioRecording(page);

      // Then stop screen recording
      await stopRecording(cdpClient);

      await browserManager.closePage();
   }
   catch (error) {
      console.error('Failed to create page: ', error);
   }
   finally {
      console.log("Stopping recording...");
      clearInterval(dismissTimeout!);
      await sleep(300);
      await browserManager.closeBrowser();
   }
})()

async function clickDismiss(page: Page): Promise<boolean> {
   try {
      const dismissButton = page
          .locator('div[role="button"]')
          .filter({hasText: 'Dismiss'})
          .first();

      if (await dismissButton.count() > 0) {
         await dismissButton.click();

         return true;
      }

      return false;
   } catch (error) {
      console.error('Failed to click dismiss button: ', error);
      return false;
   }
}

async function clickWithInnerText(
    page: Page,
    element: string,
    texts: string[]):Promise<boolean> {
   for (const text of texts) {
      try {
         console.log(`Trying to click ${element} with inner text ${text}...`);

         const selectors = [
             `${element}:has-text("${text}")`,
             `${element}:text-is("${text}")`,
             `${element}[aria-label*="${text}"]`,
         ];

         for (const selector of selectors) {
            const element = page.locator(selector);

            if (await element.count() > 0) {
               console.log(`Found ${element} with inner text ${text}!`);

               await element.click();
               console.log(`Clicked ${element} with inner text ${text}!`);
               return true;
            }
         }
      } catch (error) {
         console.error(`Failed to click ${element} with inner text ${text}: `, error);
         await sleep(300);
      }
   }

   console.log(`No element found with inner text ${texts.join(", ")}!`);
   return false;
}

function sleep(ms: number) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

async function muteMicrophone(page: Page): Promise<boolean> {
   console.log("Mute microphone...")
   try {
      const microphoneButton = page
          .locator('div[aria-label="Turn off microphone"]')
          .first();

      if (await microphoneButton.count() > 0) {
         await microphoneButton.click();
         console.log("Microphone muted!");
         return true;
      } else {
         console.log("Microphone is already muted or not found!");
         return false;
      }
   } catch (error) {
      console.error('Failed to mute microphone: ', error);
      return false;
   }
}

async function muteCamera(page: Page): Promise<boolean> {
   console.log("Mute camera...")
   try {
      const cameraButton = page
          .locator('div[aria-label="Turn off camera"]');

      if (await cameraButton.count() > 0) {
         await cameraButton.click();
         console.log("Camera muted!");
         return true;
      } else {
         console.log("Camera is already muted or not found!");
         return false;
      }
   } catch (error) {
      console.error('Failed to mute camera: ', error);
      return false;
   }
}

async function inputBotName(page: Page, name: string): Promise<boolean> {
   const nameInput = page
       .locator('input[aria-label="Your name"]')
       .first();

   if (!nameInput) {
      console.error("Name input not found!");
      return false;
   }

   await nameInput.fill(name);
   return true;
}

async function sendChatMessage(page: Page, message: string): Promise<boolean> {
   try {

      const chatOpenButton = page
         .locator('button[aria-label="Chat with everyone"]');

      const [chatButtonCount, chatButtonStateOpen] = await Promise.all([
         chatOpenButton.count(),
         chatOpenButton.getAttribute('aria-pressed'),
      ]);

      if (chatButtonCount > 0 && chatButtonStateOpen === 'false') {
         await chatOpenButton.click();
      } 
      else if (chatButtonCount > 0) {
         console.log("Chat is already open!");
      }
      else {
         console.error("Chat open button not found!");
         return false;
      }

      await page.waitForSelector("textarea[aria-label='Send a message']", {
         timeout: 10000,
      });

      const chatInput = page.locator("textarea[aria-label='Send a message']");
      if (await chatInput.count() > 0) {
         await chatInput.fill(message);
      } else {
         console.error("Chat input not found!");
         return false;
      }

      await sleep(300);
      const sendButton = page.locator("button[aria-label='Send a message']");
      if (await sendButton.count() > 0) {
         await sendButton.click();
      } else {
         console.error("Send button not found!");
         return false;
      }

      await sleep(300);
      const chatCloseButton = page.locator('button[aria-label="Close"]');
      if (await chatCloseButton.count() > 0) {
         await chatCloseButton.click();
      } else {
         console.error("Chat close button not found!");
         return false;
      }

      return true;
   } catch (error) {
      console.error('Failed to send chat message: ', error);
      return false;
   }
}

async function leaveCall(page: Page): Promise<boolean> {
   try {
      const leaveCallButton = page.locator('button[aria-label="Leave call"]');
      if (await leaveCallButton.count() > 0) {
         await leaveCallButton.click();
         return true;
      }
      console.error("Leave call button not found!");
      return false;
   } catch (error) {
      console.error('Failed to leave call: ', error);
      return false;
   }
}

// Screen recording using CDP
let recordingData: Buffer[] = [];
let audioRecordingStarted = false;

async function startRecording(cdpClient: CDPSession): Promise<void> {
   console.log("Starting screen recording using CDP...");
   recordingData = [];

   // Start capturing screenshots
   await cdpClient.send('Page.startScreencast', {
      format: 'jpeg',
      quality: 90,
      everyNthFrame: 1,
      maxWidth: 1920,
      maxHeight: 1080
   });

   // Listen for screencastFrame events
   cdpClient.on('Page.screencastFrame', async (frame) => {
      const { data, sessionId } = frame;

      // Decode base64 data
      const buffer = Buffer.from(data, 'base64');
      recordingData.push(buffer);

      // Acknowledge the frame to receive the next one
      await cdpClient.send('Page.screencastFrameAck', { sessionId });
   });

   await sleep(500);
}

// Start audio recording using the Web Audio API
async function startAudioRecording(page: Page): Promise<void> {
   console.log("Starting audio recording...");

   // Check if we've already started audio recording
   if (audioRecordingStarted) {
      console.log("Audio recording already started");
      return;
   }

   audioRecordingStarted = true;

   // Inject and execute the audio recording script
   await page.evaluate(() => {
      // Create a global variable to store audio data
      (window as any).audioChunks = [];

      // Create audio context and recorder
      const startAudioCapture = async () => {
         try {
            console.log("Requesting audio stream...");

            // Request audio stream from the browser
            // This will capture real audio from the system's microphone
            // Note: We removed the '--use-fake-device-for-media-stream' flag from browser.ts
            // because it was causing getUserMedia to return fake audio with beep sounds
            const stream = await navigator.mediaDevices.getUserMedia({ 
               audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true
               }, 
               video: false 
            });

            console.log("Audio stream obtained");

            // Create MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
               mimeType: 'audio/webm'
            });

            // Set up event handlers
            mediaRecorder.ondataavailable = (event) => {
               if (event.data.size > 0) {
                  (window as any).audioChunks.push(event.data);
               }
            };

            // Start recording
            mediaRecorder.start(1000); // Capture in 1-second chunks
            console.log("Audio recording started");

            // Store the mediaRecorder in a global variable so we can stop it later
            (window as any).mediaRecorder = mediaRecorder;
         } catch (error) {
            console.error("Error starting audio capture:", error);
         }
      };

      // Start audio capture
      startAudioCapture();
   });

   console.log("Audio recording script injected");
}

// Stop audio recording and save the audio file
async function stopAudioRecording(page: Page): Promise<boolean> {
   console.log("Stopping audio recording...");

   if (!audioRecordingStarted) {
      console.log("Audio recording was not started");
      return false;
   }

   try {
      // Stop the MediaRecorder and get the audio data
      const audioBlob = await page.evaluate(async () => {
         try {
            // Check if mediaRecorder exists and is recording
            if ((window as any).mediaRecorder && (window as any).mediaRecorder.state === 'recording') {
               // Create a promise that resolves when the mediaRecorder stops
               const stopPromise = new Promise<Blob>((resolve) => {
                  (window as any).mediaRecorder.onstop = () => {
                     // Create a blob from all the chunks
                     const audioBlob = new Blob((window as any).audioChunks, { type: 'audio/webm' });
                     resolve(audioBlob);
                  };
               });

               // Stop the recording
               (window as any).mediaRecorder.stop();
               console.log("MediaRecorder stopped");

               // Wait for the onstop event to fire and return the blob
               return await stopPromise;
            } else {
               console.log("MediaRecorder not found or not recording");
               return null;
            }
         } catch (error) {
            console.error("Error stopping audio recording:", error);
            return null;
         }
      });

      if (!audioBlob) {
         console.error("Failed to get audio data");
         return false;
      }

      // Get the audio data as a base64 string (which can be properly serialized)
      const audioBase64 = await page.evaluate(async () => {
         const blob = new Blob((window as any).audioChunks, { type: 'audio/webm' });
         const reader = new FileReader();
         return new Promise<string>((resolve) => {
            reader.onloadend = () => {
               // FileReader result is a data URL like "data:audio/webm;base64,<base64data>"
               // We extract just the base64 part
               const base64 = reader.result?.toString().split(',')[1];
               resolve(base64 || '');
            };
            reader.readAsDataURL(blob);
         });
      });

      if (!audioBase64) {
         console.error("Failed to get audio data as base64");
         return false;
      }

      // Convert base64 string to Buffer and save to file
      const audioBuffer = Buffer.from(audioBase64, 'base64');
      fs.writeFileSync(AUDIO_PATH, audioBuffer);
      console.log(`Audio saved to ${AUDIO_PATH}`);

      audioRecordingStarted = false;
      return true;
   } catch (error) {
      console.error("Error stopping audio recording:", error);
      return false;
   }
}

async function stopRecording(cdpClient: CDPSession): Promise<void> {
   console.log("Stopping screen recording...");

   // Stop the screencast
   await cdpClient.send('Page.stopScreencast');

   // Save the recording data
   if (recordingData.length > 0) {
      console.log(`Converting ${recordingData.length} frames to video...`);

      // Create a temporary directory for the frames
      const tempDir = path.join(process.cwd(), 'temp_frames');
      if (!fs.existsSync(tempDir)) {
         fs.mkdirSync(tempDir, { recursive: true });
      } else {
         // Clean up any existing files
         const files = fs.readdirSync(tempDir);
         for (const file of files) {
            fs.unlinkSync(path.join(tempDir, file));
         }
      }

      // Save each frame as a JPEG file
      for (let i = 0; i < recordingData.length; i++) {
         const frameFile = path.join(tempDir, `frame_${i.toString().padStart(6, '0')}.jpg`);
         fs.writeFileSync(frameFile, recordingData[i]);
      }

      // Create the output directory if it doesn't exist
      const outputDir = path.dirname(VIDEO_PATH);
      if (!fs.existsSync(outputDir)) {
         fs.mkdirSync(outputDir, { recursive: true });
      }

      // Check if audio file exists
      const hasAudio = fs.existsSync(AUDIO_PATH);

      // Use FFmpeg to convert the frames to a video
      console.log("Converting frames to video using FFmpeg...");
      try {
         // Ensure ffmpegPath is defined
         if (!ffmpegPath) {
            throw new Error("FFmpeg path is not defined");
         }

         // Build the FFmpeg command
         let ffmpegCommand = [
            '-framerate', '30',
            '-i', path.join(tempDir, 'frame_%06d.jpg')
         ];

         // Add audio input if available
         if (hasAudio) {
            ffmpegCommand = ffmpegCommand.concat([
               '-i', AUDIO_PATH,
               '-c:a', 'libopus',  // Use Opus codec for audio
               '-c:v', 'libvpx-vp9',
               '-pix_fmt', 'yuv420p',
               '-shortest',  // End when the shortest input stream ends
               '-y',  // Overwrite output file if it exists
               VIDEO_PATH
            ]);
            console.log("Including audio in the output video");
         } else {
            ffmpegCommand = ffmpegCommand.concat([
               '-c:v', 'libvpx-vp9',
               '-pix_fmt', 'yuv420p',
               '-y',  // Overwrite output file if it exists
               VIDEO_PATH
            ]);
            console.log("No audio file found, creating video without audio");
         }

         // Execute FFmpeg
         const ffmpegProcess = child_process.spawnSync(ffmpegPath, ffmpegCommand, {
            stdio: 'inherit'
         });

         if (ffmpegProcess.status === 0) {
            console.log(`Video saved to ${VIDEO_PATH}`);

            // Clean up audio file if it was used
            if (hasAudio) {
               fs.unlinkSync(AUDIO_PATH);
               console.log(`Removed temporary audio file ${AUDIO_PATH}`);
            }
         } else {
            console.error(`FFmpeg exited with code ${ffmpegProcess.status}`);
            // Save at least one frame as a fallback
            fs.writeFileSync(VIDEO_PATH.replace('.webm', '.jpg'), recordingData[0]);
            console.log(`Fallback: First frame saved as ${VIDEO_PATH.replace('.webm', '.jpg')}`);
         }
      } catch (error) {
         console.error("Error converting frames to video:", error);
         // Save at least one frame as a fallback
         fs.writeFileSync(VIDEO_PATH.replace('.webm', '.jpg'), recordingData[0]);
         console.log(`Fallback: First frame saved as ${VIDEO_PATH.replace('.webm', '.jpg')}`);
      }

      // Clean up the temporary directory
      try {
         const files = fs.readdirSync(tempDir);
         for (const file of files) {
            fs.unlinkSync(path.join(tempDir, file));
         }
         fs.rmdirSync(tempDir);
      } catch (error) {
         console.error("Error cleaning up temporary directory:", error);
      }

      console.log("Recording process completed!");
   } else {
      console.error("No recording data to save!");
   }
}
