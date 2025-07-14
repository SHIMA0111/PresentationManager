export interface Record {
    startRecording(width: number, height: number, quality: number): void;
    stopRecording(): void;
}