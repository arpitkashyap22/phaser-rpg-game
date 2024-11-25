import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";

function App() {
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} currentActiveScene={(scene) => console.log("Active Scene:", scene.scene.key)} />
    </div>
  );
}

export default App;
