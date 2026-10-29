// In-browser WebM Video Recorder using HTML5 Canvas CaptureStream & MediaRecorder

export class CanvasVideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;

  public startRecording(canvas: HTMLCanvasElement, fps = 60): boolean {
    try {
      this.recordedChunks = [];
      const stream = canvas.captureStream(fps);

      let chosenMime = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(chosenMime)) {
        chosenMime = 'video/webm';
      }

      const options: MediaRecorderOptions = { mimeType: chosenMime };
      this.mediaRecorder = new MediaRecorder(stream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Adela_The_Best_Teacher_Tribute_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 150);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      return true;
    } catch (err) {
      console.error('Failed to start video recording:', err);
      return false;
    }
  }

  public stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  public getIsRecording() {
    return this.isRecording;
  }
}
