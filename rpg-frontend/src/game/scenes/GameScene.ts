import Phaser from "phaser";
import { io } from "socket.io-client";

export class GameScene extends Phaser.Scene {
  private socket: any;
  private players: { [id: string]: Phaser.GameObjects.Sprite } = {};
  private player!: Phaser.GameObjects.Sprite;
  private playerIndicator!: Phaser.GameObjects.Graphics; // Green dot indicator
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private notifications!: Phaser.GameObjects.Text;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("GameScene");
  }

  init() {
    // Initialize Socket.IO
    this.socket = io("https://phaser-rpg-game-production.up.railway.app/");
  }

  create() {
    // Add the main player sprite with physics
    this.player = this.physics.add.sprite(400, 300, "player").setScale(1.5);
    this.player.setCollideWorldBounds(true); // Prevent leaving the world bounds

    // Add a green dot above the player
    this.playerIndicator = this.add.graphics();
    this.playerIndicator.fillStyle(0x00ff00, 1); // Green color
    this.playerIndicator.fillCircle(0, 0, 5); // Circle with radius 5
    this.playerIndicator.setDepth(10); // Ensure it appears above other objects

    // Initialize keyboard cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // Display notifications
    this.notifications = this.add
      .text(10, 10, "", { fontSize: "16px", color: "#fff" })
      .setScrollFactor(0)
      .setDepth(10);

    // Create obstacles
    this.obstacles = this.physics.add.staticGroup();
    this.createObstacles();

    // Add collision between the player and obstacles
    this.physics.add.collider(this.player, this.obstacles);


    // Handle Socket.IO Events
    this.socket.emit("enterGame", { name: `Player${this.socket.id}` });

    this.socket.on("currentPlayers", (players: any[]) => {
      players.forEach((player: any) => {
        if (player.id !== this.socket.id) {
          this.addOtherPlayer(player);
        }
      });
    });

    this.socket.on("playerJoined", (player: any) => {
      if (player.id !== this.socket.id) {
        this.addOtherPlayer(player);
        this.showNotification(`${player.name} joined the game.`);
      }
    });

    this.socket.on("playerMoved", (player: any) => {
      if (this.players[player.id]) {
        this.players[player.id].setPosition(player.x, player.y);
      }
    });

    this.socket.on("playerLeft", (player: any) => {
      if (this.players[player.id]) {
        this.players[player.id].destroy(); // Remove the sprite from the scene
        delete this.players[player.id];   // Remove the reference from the players object
        this.showNotification(`${player.name} left the game.`);
      }
    });
  }

  update() {
    const speed = 200; // Player speed in pixels per second
    const delta = this.game.loop.delta / 1000; // Delta time
    let moved = false;

    // Check cursor keys for movement
    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-speed);
      moved = true;
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(speed);
      moved = true;
    } else {
      this.player.setVelocityY(0);
    }

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-speed);
      moved = true;
     
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(speed);
      moved = true;
    } else {
      this.player.setVelocityX(0);
    }

    // Update the green dot position
    this.playerIndicator.setPosition(this.player.x, this.player.y - 30);

    // Emit movement updates if the player moved
    if (moved) {
      this.socket.emit("playerMovement", { x: this.player.x, y: this.player.y });
    }
  }

  private addOtherPlayer(player: any) {
    const otherPlayer = this.add
      .sprite(player.x, player.y, "otherPlayer")
      .setScale(1.5);
    this.players[player.id] = otherPlayer;
  }

  private createObstacles() {
    // Add a few obstacles
    this.obstacles.create(200, 200, "obstacle").setScale(2.5).refreshBody();
    this.obstacles.create(400, 400, "obstacle").setScale(1.5).refreshBody();
  }

  private showNotification(message: string) {
    this.notifications.setText(message);

    // Fade out the notification after 3 seconds
    this.time.delayedCall(3000, () => {
      this.notifications.setText("");
    });
  }
}
