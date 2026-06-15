import { ENGrid } from "@4site/engrid-scripts";

export default class Confetti {
  private readonly pieceCount = 200;
  private readonly launchDelay = 1000;
  private readonly cleanupDelay = 3000;
  private readonly colors = ['#f7931e', '#5DD8D8', '#39B54A', '#CEE4C5', '#362229'];

  constructor() {
    if (this.shouldRun()) {
      window.setTimeout(() => this.launch(), this.launchDelay);
    }
  }

  private shouldRun() {
    return ENGrid.getPageType() === "DONATION" && ENGrid.isThankYouPage() === true;
  }

  private launch() {
    const container = document.createElement("div");
    container.classList.add("confetti-container");

    for (let index = 0; index < this.pieceCount; index += 1) {
      container.appendChild(this.createPiece());
    }

    document.body.appendChild(container);

    window.setTimeout(() => {
      container.remove();
    }, this.cleanupDelay);
  }

  private createPiece() {
    const piece = document.createElement("div");
    const shape = this.randomInt(1, 3);
    const rotationStart = this.randomNumber(0, 360);
    const rotationDirection = Math.random() < 0.5 ? -1 : 1;
    const rotationEnd = rotationStart + this.randomNumber(90, 270) * rotationDirection;

    const color = this.colors[this.randomInt(0, this.colors.length - 1)];

    piece.classList.add(`confetti-${shape}`);
    piece.style.setProperty("--x", `${this.randomNumber(0, 100).toFixed(2)}%`);
    piece.style.setProperty("--start-y", `${this.randomNumber(-200, -50).toFixed(0)}px`);
    piece.style.setProperty("--duration", `${this.randomNumber(1.3, 1.7).toFixed(2)}s`);
    piece.style.setProperty("--delay", `${this.randomNumber(0, 1.5).toFixed(2)}s`);
    piece.style.setProperty("--rotation-start", `${rotationStart.toFixed(0)}deg`);
    piece.style.setProperty("--rotation-end", `${rotationEnd.toFixed(0)}deg`);
    piece.style.setProperty("--scale", this.randomNumber(1.2, 1.8).toFixed(2));
    piece.style.setProperty("--piece-color", color);

    return piece;
  }

  private randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private randomInt(min: number, max: number) {
    return Math.floor(this.randomNumber(min, max + 1));
  }
}
