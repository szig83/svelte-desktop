// WindowManager class: Manages windows (open, close, z-index, focus)
export class WindowManager {
  private windows: string[] = []; // Array of window IDs
  private zIndexCounter = 1;

  openWindow(id: string) {
    if (!this.windows.includes(id)) {
      this.windows.push(id);
      this.bringToFront(id);
    }
  }

  closeWindow(id: string) {
    this.windows = this.windows.filter(w => w !== id);
  }

  bringToFront(id: string) {
    // Remove from current position and add to end
    this.windows = this.windows.filter(w => w !== id);
    this.windows.push(id);
  }

  getZIndex(id: string): number {
    const index = this.windows.indexOf(id);
    return index >= 0 ? index + 1 : 0; // Z-index starts from 1
  }

  getWindows(): string[] {
    return [...this.windows]; // Return a copy
  }
}
