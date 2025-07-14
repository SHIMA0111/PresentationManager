import {CDPSession} from "playwright";
import {Record} from "../record";
import path from "node:path";
import * as fs from "node:fs";
import ffmpegPath from "ffmpeg-static";
import * as child_process from "node:child_process";

export class TabRecorder implements Record {
    private cdpClient: CDPSession;
    private recordingData: Buffer[];
    private recordingTimestamp: number[];
    private readonly tempDir: string;
    private readonly outputPath: string;

    private recordingStarted: boolean = false;
    private recordingDuration: number = 0;

    constructor(cdpClient: CDPSession, outputPath: string = `${path.basename(process.cwd())}/recordings`) {
        this.cdpClient = cdpClient;
        this.recordingData = [];
        this.recordingTimestamp = [];
        this.outputPath = outputPath;
        this.tempDir = path.join('/tmp', `meet-bot-${Date.now()}`);
    }

    async startRecording(width: number, height: number, quality: number = 100) {
        await this.cdpClient.send('Page.startScreencast', {
            format: "jpeg",
            quality: quality,
            maxWidth: width,
            maxHeight: height,
            everyNthFrame: 1,
        });
        this.recordingDuration = Date.now();
        this.recordingStarted = true;

        this.cdpClient.on('Page.screencastFrame', async (message) => {
            const { data, metadata, sessionId } = message;

            const buffer = Buffer.from(data, "base64");
            this.recordingData.push(buffer);

            if (metadata.timestamp) {
                this.recordingTimestamp.push(metadata.timestamp)
            } else {
                const currentTimestamp = Date.now();
                this.recordingTimestamp.push(currentTimestamp - this.recordingDuration);
                this.recordingDuration = currentTimestamp;
            }

            await this.cdpClient.send('Page.screencastFrameAck', { sessionId })
        });
    }

    async stopRecording() {
        await this.cdpClient.send('Page.stopScreencast');

        if (this.recordingData.length > 0) {
            if (!fs.existsSync(this.tempDir)) {
                fs.mkdirSync(this.tempDir, {  recursive: true });
            }

            for (let i = 0; i < this.recordingData.length; i++) {
                const frameFile = path.join(this.tempDir, `frame-${i.toString().padStart(6, '0')}.jpg`);
                fs.writeFileSync(frameFile, this.recordingData[i]);
            }

            if (!fs.existsSync(this.outputPath)) {
                fs.mkdirSync(this.outputPath, {  recursive: true });
            }

            const isCombineAudio = fs.existsSync(path.join(this.tempDir, 'audio.wav'));

            try {
                if (!ffmpegPath) {
                    throw new Error('ffmpeg-static is not installed');
                }

                let ffmpegCommand = [
                    '-framerate', '30',
                    '-i', path.join(this.tempDir, 'frame-%06d.jpg'),
                ];

                const videoPath = path.join(this.outputPath, 'output_video.webm');
                if (isCombineAudio) {
                    ffmpegCommand = ffmpegCommand.concat([
                        '-i', path.join(this.tempDir, 'audio.wav'),
                        '-c:a', 'libopus',
                        '-c:v', 'libvpx-vp9',
                        '-pix_fmt', 'yuv420p',
                        '-shortest',
                        '-y',
                        videoPath,
                    ]);
                } else {
                    ffmpegCommand = ffmpegCommand.concat([
                        '-c:v', 'libvpx-vp9',
                        '-pix_fmt', 'yuv420p',
                        '-y',
                        videoPath,
                    ]);
                }

                const ffmpegProcess = child_process.spawnSync(ffmpegPath, ffmpegCommand, {
                    stdio: 'inherit',
                });

                if (ffmpegProcess.status === 0 && isCombineAudio) {
                    fs.unlinkSync(path.join(this.tempDir, 'audio.wav'));
                } else {
                    fs.writeFileSync(videoPath.replace(".webm", ".jpg"), this.recordingData[0]);
                    console.error("Error while combining frames and audio: ", ffmpegProcess.stderr.toString());
                }
            } catch (error) {
                console.error("Error while combining frames and audio: ", error);
                fs.writeFileSync(path.join(this.outputPath, 'output_video.webm'), this.recordingData[0]);
            }

            try {
                fs.rmSync(this.tempDir, {
                    recursive: true,
                    force: true,
                });
            } catch (error) {
                console.error("Error while removing temp directory: ", error);
            }
        } else {
            console.error("No frames recorded!");
        }

        this.recordingStarted = false;
        this.recordingData = [];
        this.recordingTimestamp = [];
    }
}