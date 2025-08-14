import RoomBackground from "./components/RoomBackground";
import Monitor from "./components/Monitor";
import Screen from "./components/Screen";
import HUD from "./components/HUD";

function App() {
  return (
    <>
      <RoomBackground />
      <Monitor>
        <Screen>
          <HUD />
        </Screen>
      </Monitor>
    </>
  );
}

export default App;