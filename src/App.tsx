import RoomBackground from "./components/RoomBackground"
import Monitor from "./components/Monitor"
import Screen from "./components/Screen"
import MissionControl from "./components/MissionControl"

function App() {
  return (
    <>
      <RoomBackground />
      <Monitor>
        <Screen>
          <MissionControl />
        </Screen>
      </Monitor>
    </>
  );
}

export default App