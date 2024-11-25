import Phaser from "phaser";
import { io } from "socket.io-client";

export class MainMenu extends Phaser.Scene {
  private inputField!: HTMLInputElement;
  private startButton!: Phaser.GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  preload() {
    // Load any assets needed for the Main Menu
  }

  init() {
    // Initialize Socket.IO
    this.socket = io("https://phaser-rpg-game-production.up.railway.app/");
  }
  
  create() {
    // Add background or title text
    this.add.text(400, 100, "Multiplayer Game", {
      fontSize: "32px",
      color: "#ffffff",
    }).setOrigin(0.5);

    // Create a DOM input element for the player to enter their name
    this.createInputField();

    // Add a start button
    this.startButton = this.add
      .text(400, 300, "Start Game", {
        fontSize: "24px",
        color: "#ffffff",
        backgroundColor: "#007bff",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.startGame());
  }

  private createInputField() {
    this.inputField = document.createElement("input");
    this.inputField.type = "text";
    this.inputField.placeholder = "Enter your name...";
    this.inputField.style.position = "absolute";
    this.inputField.style.top = "200px";
    this.inputField.style.left = "calc(50% - 100px)";
    this.inputField.style.width = "200px";
    this.inputField.style.height = "30px";
    this.inputField.style.fontSize = "16px";
    this.inputField.style.textAlign = "center";
    document.body.appendChild(this.inputField);
  }

  private startGame() {
    const playerName = this.inputField.value.trim();
    if (playerName) {
      // Store the player's name (you can pass it to the next scene)
      this.scene.start("GameScene", { playerName });
      
      // Remove the input field
      this.inputField.remove();
    } else {
      alert("Please enter your name before starting the game.");
    }
  }

  shutdown() {
    // Remove the input field when the scene is destroyed
    this.inputField?.remove();
  }
}
