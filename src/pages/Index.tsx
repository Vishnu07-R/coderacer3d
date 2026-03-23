import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { getUserId } from "@/lib/userStore";
import SplashScreen from "@/components/SplashScreen";
import LoginScreen from "@/components/LoginScreen";
import CreateAccountScreen from "@/components/CreateAccountScreen";
import LoadingScreen from "@/components/LoadingScreen";
import LobbyScreen from "@/components/LobbyScreen";
import LanguageSelect from "@/components/LanguageSelect";
import LevelSelect from "@/components/LevelSelect";
import TopicSelect from "@/components/TopicSelect";
import GarageScreen from "@/components/GarageScreen";
import LeaderboardScreen from "@/components/LeaderboardScreen";
import AIAssistantScreen from "@/components/AIAssistantScreen";
import MultiplayerScreen from "@/components/MultiplayerScreen";
import CharacterScreen from "@/components/CharacterScreen";
import CodeLibraryScreen from "@/components/CodeLibraryScreen";
import GameplayScreen from "@/components/GameplayScreen";

type Screen =
  | "splash" | "login" | "create-account" | "login-loading" | "lobby" | "lobby-loading"
  | "language" | "language-loading" | "level" | "level-loading" | "topic" | "topic-loading"
  | "gameplay" | "garage" | "garage-loading" | "leaderboard" | "leaderboard-loading"
  | "assistant" | "assistant-loading" | "friends" | "friends-loading"
  | "character" | "character-loading" | "library" | "library-loading";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedLang, setSelectedLang] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const goTo = useCallback((s: Screen) => setScreen(s), []);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {screen === "splash" && <SplashScreen key="splash" onStart={() => goTo(getUserId() ? "login-loading" : "login")} />}

        {screen === "login" && <LoginScreen key="login" onLogin={() => goTo("login-loading")} onCreateAccount={() => goTo("create-account")} />}

        {screen === "create-account" && <CreateAccountScreen key="create-account" onRegister={() => goTo("login-loading")} onBack={() => goTo("login")} />}

        {screen === "login-loading" && (
          <LoadingScreen key="login-loading" messages={["AUTHENTICATING...", "LOADING PROFILE...", "SYNCING DATA..."]} duration={2500} onComplete={() => goTo("lobby")} />
        )}

        {screen === "lobby" && (
          <LobbyScreen key="lobby" onNavigate={(page) => {
            if (page === "race") goTo("lobby-loading");
            else if (page === "garage") goTo("garage-loading");
            else if (page === "leaderboard") goTo("leaderboard-loading");
            else if (page === "assistant") goTo("assistant-loading");
            else if (page === "friends") goTo("friends-loading");
            else if (page === "character") goTo("character-loading");
            else if (page === "library") goTo("library-loading");
          }} onLogout={() => goTo("login")} />
        )}

        {screen === "lobby-loading" && <LoadingScreen key="lobby-loading" messages={["LOADING TRACKS...", "PREPARING ARENA..."]} duration={1500} onComplete={() => goTo("language")} />}
        {screen === "garage-loading" && <LoadingScreen key="garage-loading" messages={["OPENING GARAGE...", "LOADING ASSETS..."]} duration={1500} onComplete={() => goTo("garage")} />}
        {screen === "garage" && <GarageScreen key="garage" onBack={() => goTo("lobby")} />}
        {screen === "leaderboard-loading" && <LoadingScreen key="leaderboard-loading" messages={["FETCHING RANKINGS...", "LOADING STATS..."]} duration={1500} onComplete={() => goTo("leaderboard")} />}
        {screen === "leaderboard" && <LeaderboardScreen key="leaderboard" onBack={() => goTo("lobby")} />}
        {screen === "assistant-loading" && <LoadingScreen key="assistant-loading" messages={["INITIALIZING AI...", "LOADING KNOWLEDGE BASE..."]} duration={1500} onComplete={() => goTo("assistant")} />}
        {screen === "assistant" && <AIAssistantScreen key="assistant" onBack={() => goTo("lobby")} />}
        {screen === "friends-loading" && <LoadingScreen key="friends-loading" messages={["CONNECTING TO ARENA...", "FINDING PLAYERS..."]} duration={1500} onComplete={() => goTo("friends")} />}
        {screen === "friends" && <MultiplayerScreen key="friends" onBack={() => goTo("lobby")} onRaceStart={(room) => { setSelectedLang("javascript"); setSelectedLevel("beginner"); setSelectedTopic("multiplayer"); goTo("gameplay"); }} />}
        {screen === "character-loading" && <LoadingScreen key="character-loading" messages={["LOADING CO-PILOT...", "SYNCING STATS..."]} duration={1500} onComplete={() => goTo("character")} />}
        {screen === "character" && <CharacterScreen key="character" onBack={() => goTo("lobby")} />}
        {screen === "library-loading" && <LoadingScreen key="library-loading" messages={["LOADING LIBRARY...", "INDEXING RESOURCES..."]} duration={1500} onComplete={() => goTo("library")} />}
        {screen === "library" && <CodeLibraryScreen key="library" onBack={() => goTo("lobby")} />}

        {screen === "language" && <LanguageSelect key="language" onSelect={(lang) => { setSelectedLang(lang); goTo("language-loading"); }} onBack={() => goTo("lobby")} />}
        {screen === "language-loading" && <LoadingScreen key="lang-loading" messages={[`LOADING ${selectedLang.toUpperCase()} TRACK...`, "COMPILING CHALLENGES..."]} duration={1500} onComplete={() => goTo("level")} />}
        {screen === "level" && <LevelSelect key="level" language={selectedLang} onSelect={(lvl) => { setSelectedLevel(lvl); goTo("level-loading"); }} onBack={() => goTo("language")} />}
        {screen === "level-loading" && <LoadingScreen key="level-loading" messages={["GENERATING CHALLENGES...", "SETTING DIFFICULTY..."]} duration={1500} onComplete={() => goTo("topic")} />}
        {screen === "topic" && <TopicSelect key="topic" language={selectedLang} level={selectedLevel} onSelect={(topic) => { setSelectedTopic(topic); goTo("topic-loading"); }} onBack={() => goTo("level")} />}
        {screen === "topic-loading" && <LoadingScreen key="topic-loading" messages={["INITIALIZING RACE...", "SPAWNING OPPONENTS...", "STARTING ENGINE..."]} duration={1500} onComplete={() => goTo("gameplay")} />}
        {screen === "gameplay" && <GameplayScreen key="gameplay" language={selectedLang} level={selectedLevel} topic={selectedTopic} onFinish={() => goTo("lobby")} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
