import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import Phaser from "phaser";
import { GameScene } from "./scenes/GameScene";
import { MainMenu } from "./scenes/MainMenu";
import { PreloadScene } from "./scenes/PreloadScene";

export interface IRefPhaserGame {
  scene: Phaser.Scene | null;
}

export const PhaserGame = forwardRef<IRefPhaserGame>((_, ref) => {
  let game: Phaser.Game | null = null;

  useImperativeHandle(ref, () => ({
    scene: game?.scene.getScene("GameScene") || null,
  }));

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "phaser-game", // Attach the game to this div
      backgroundColor: "#87CEEB",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: [PreloadScene, MainMenu, GameScene], // Add all scenes
    };

    // Initialize Phaser game
    game = new Phaser.Game(config);

    return () => {
      game?.destroy(true);
    };
  }, []);

  return <div id="phaser-game" />;
});
