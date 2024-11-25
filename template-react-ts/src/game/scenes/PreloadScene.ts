import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("player", "/assets/king.png"); 
    this.load.image("otherPlayer", "/assets/king.png"); 
    this.load.image("obstacle", "/assets/star.png");

     // Log success and failure
  this.load.on("filecomplete", (key: string) => {
    console.log(`Loaded: ${key}`);
  });

  this.load.on("loaderror", (file: Phaser.Loader.File) => {
    console.error(`Failed to load: ${file.key}`);
  });

  }

  create() {
    this.scene.start("MainMenu");
  }
}
