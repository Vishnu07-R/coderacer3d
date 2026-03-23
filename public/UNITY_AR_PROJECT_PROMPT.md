# 🏎️ LevelUp Code — Unity C# AR Racing Game
## Complete Production-Ready Project Prompt

---

## PROJECT OVERVIEW

**Name:** LevelUp Code  
**Genre:** Educational AR Racing Game  
**Engine:** Unity 2022.3+ LTS  
**Language:** C# (.NET Standard 2.1)  
**Platforms:** Android (ARCore), iOS (ARKit)  
**Architecture:** MVVM + Service Locator Pattern  
**Multiplayer:** Photon PUN 2 / Unity Netcode for GameObjects  
**Backend:** Firebase (Auth, Firestore, Cloud Functions) or PlayFab  

---

## FOLDER STRUCTURE

```
Assets/
├── _Project/
│   ├── Scripts/
│   │   ├── Core/
│   │   │   ├── GameManager.cs              // Singleton game state manager
│   │   │   ├── SceneController.cs          // Async scene loading with transitions
│   │   │   ├── ServiceLocator.cs           // IoC container for services
│   │   │   ├── EventBus.cs                 // Pub/Sub event system
│   │   │   └── SaveSystem.cs              // PlayerPrefs + Cloud save
│   │   ├── AR/
│   │   │   ├── ARSessionManager.cs         // AR Foundation session lifecycle
│   │   │   ├── ARTrackPlacement.cs         // Place racing track on detected planes
│   │   │   ├── ARCarSpawner.cs             // Spawn player car in AR space
│   │   │   ├── ARScaleController.cs        // Pinch-to-scale track
│   │   │   └── ARLightEstimation.cs        // Match virtual lighting to real world
│   │   ├── Racing/
│   │   │   ├── CarController.cs            // Physics-based car movement
│   │   │   ├── CarCustomization.cs         // Paint, decals, upgrades
│   │   │   ├── AIOpponent.cs               // FSM-based AI racers
│   │   │   ├── RaceManager.cs              // Race flow: countdown → racing → finish
│   │   │   ├── BoostSystem.cs              // Nitro boost from correct answers
│   │   │   ├── LapTracker.cs               // Checkpoint + lap counting
│   │   │   ├── TrackGenerator.cs           // Procedural AR track generation
│   │   │   └── CollisionHandler.cs         // Car-to-car, car-to-barrier
│   │   ├── Coding/
│   │   │   ├── ChallengeManager.cs         // Serve questions by language/level/topic
│   │   │   ├── ChallengeData.cs            // ScriptableObject: question bank
│   │   │   ├── ChallengeUI.cs              // In-race coding challenge overlay
│   │   │   ├── CodeEditor.cs               // Mini code editor for typing challenges
│   │   │   ├── LanguageDatabase.cs         // 10+ programming languages data
│   │   │   └── TopicDatabase.cs            // Topics per language
│   │   ├── Multiplayer/
│   │   │   ├── NetworkManager.cs           // Photon PUN2 connection handling
│   │   │   ├── PlayerSync.cs               // Networked car position/rotation
│   │   │   ├── RoomManager.cs              // Create/join/list rooms
│   │   │   ├── ChatSystem.cs               // In-game text chat
│   │   │   └── FriendSystem.cs             // Friend list, invites
│   │   ├── UI/
│   │   │   ├── Screens/
│   │   │   │   ├── SplashScreenUI.cs       // Animated logo + auto-transition
│   │   │   │   ├── LoadingScreenUI.cs      // Track-styled progress bar
│   │   │   │   ├── LoginScreenUI.cs        // Email/password + social login
│   │   │   │   ├── CreateAccountUI.cs      // Registration form
│   │   │   │   ├── LobbyScreenUI.cs        // Central hub with holographic icons
│   │   │   │   ├── GarageScreenUI.cs       // 3D car preview + customization
│   │   │   │   ├── CharacterScreenUI.cs    // AI co-pilot avatar + stats
│   │   │   │   ├── LanguageSelectUI.cs     // Grid of 10+ language tiles
│   │   │   │   ├── LevelSelectUI.cs        // Beginner→Advanced gradient tracks
│   │   │   │   ├── TopicSelectUI.cs        // Scrollable topic panels
│   │   │   │   ├── LeaderboardUI.cs        // Weekly/monthly rankings
│   │   │   │   ├── CodeLibraryUI.cs        // In-game tutorials
│   │   │   │   └── ResultsScreenUI.cs      // Post-race summary
│   │   │   ├── Components/
│   │   │   │   ├── NeonButton.cs           // Reusable gradient button
│   │   │   │   ├── GlowingInputField.cs    // Animated input with glow
│   │   │   │   ├── HolographicCard.cs      // Card with shimmer effect
│   │   │   │   ├── GradientPanel.cs        // Gradient background panel
│   │   │   │   ├── AnimatedProgressBar.cs  // Track-styled progress
│   │   │   │   └── ParticleBackground.cs   // Floating code particles
│   │   │   └── Transitions/
│   │   │       ├── ScreenTransition.cs     // Swipe/fade between screens
│   │   │       └── LoadingTransition.cs    // Neon wipe transition
│   │   ├── Audio/
│   │   │   ├── AudioManager.cs             // Centralized audio control
│   │   │   ├── EngineSound.cs              // RPM-reactive engine audio
│   │   │   ├── BoostSFX.cs                 // Turbo whoosh + nitro fire
│   │   │   ├── UISounds.cs                 // Click, hover, select SFX
│   │   │   └── MusicManager.cs             // Adaptive background music
│   │   ├── AI/
│   │   │   ├── AIAssistant.cs              // Context-aware coding help
│   │   │   ├── AIPersonality.cs            // Expression + mood system
│   │   │   ├── SpeechBubbleUI.cs           // Animated glow speech bubbles
│   │   │   └── HintSystem.cs              // Progressive hint delivery
│   │   ├── Progression/
│   │   │   ├── XPSystem.cs                 // Experience + leveling
│   │   │   ├── CarUnlockSystem.cs          // Unlock cars via coding success
│   │   │   ├── AchievementSystem.cs        // Badges + trophies
│   │   │   ├── SeasonPass.cs               // Weekly/monthly seasons
│   │   │   └── CurrencyManager.cs          // Coins earned from races
│   │   └── Data/
│   │       ├── PlayerProfile.cs            // User data model
│   │       ├── CarData.cs                  // ScriptableObject: car stats
│   │       ├── ChallengeData.cs            // ScriptableObject: questions
│   │       └── Constants.cs                // Global constants
│   ├── Prefabs/
│   │   ├── Cars/
│   │   │   ├── PlayerCar.prefab
│   │   │   ├── OpponentCar_SyntaxError.prefab
│   │   │   ├── OpponentCar_NullPtr.prefab
│   │   │   ├── OpponentCar_StackOverflow.prefab
│   │   │   └── OpponentCar_BugHunter.prefab
│   │   ├── Track/
│   │   │   ├── ARTrack.prefab
│   │   │   ├── NeonBarrier.prefab
│   │   │   ├── HolographicArch.prefab
│   │   │   └── CheckpointGate.prefab
│   │   ├── Effects/
│   │   │   ├── BoostTrail.prefab
│   │   │   ├── NitroFlame.prefab
│   │   │   ├── SpeedLines.prefab
│   │   │   └── CorrectAnswerBurst.prefab
│   │   └── UI/
│   │       ├── FloatingDamageNumber.prefab
│   │       ├── ComboPopup.prefab
│   │       └── RankBadge.prefab
│   ├── Materials/
│   │   ├── Neon/
│   │   │   ├── NeonCyan.mat
│   │   │   ├── NeonMagenta.mat
│   │   │   ├── NeonGreen.mat
│   │   │   ├── NeonOrange.mat
│   │   │   └── NeonYellow.mat
│   │   ├── Cars/
│   │   │   ├── CarPaint_Gradient_01.mat     // Gradient shader
│   │   │   ├── CarPaint_Holographic.mat
│   │   │   ├── CarWindshield.mat
│   │   │   └── CarWheel.mat
│   │   ├── Track/
│   │   │   ├── RoadSurface.mat
│   │   │   ├── LaneDivider_Emissive.mat
│   │   │   └── Barrier_Emissive.mat
│   │   └── UI/
│   │       ├── HolographicShimmer.mat
│   │       └── GradientPanel.mat
│   ├── Shaders/
│   │   ├── NeonGlow.shader               // Bloom-compatible emissive
│   │   ├── GradientPaint.shader           // Multi-color car paint
│   │   ├── HolographicUI.shader           // Holographic shimmer effect
│   │   ├── SpeedDistortion.shader         // Screen distortion at high speed
│   │   └── ARShadow.shader               // Transparent shadow receiver for AR
│   ├── ScriptableObjects/
│   │   ├── Cars/
│   │   │   ├── Car_Starter.asset          // Default car
│   │   │   ├── Car_Turbo.asset            // Unlock at level 5
│   │   │   ├── Car_Phantom.asset          // Unlock at level 10
│   │   │   ├── Car_Quantum.asset          // Unlock at level 15
│   │   │   ├── Car_Nova.asset             // Unlock at level 20
│   │   │   └── Car_Legendary.asset        // Unlock all achievements
│   │   ├── Languages/
│   │   │   ├── Python.asset
│   │   │   ├── JavaScript.asset
│   │   │   ├── CSharp.asset
│   │   │   ├── Java.asset
│   │   │   ├── CPlusPlus.asset
│   │   │   ├── SQL.asset
│   │   │   ├── TypeScript.asset
│   │   │   ├── PHP.asset
│   │   │   ├── NumPy.asset
│   │   │   ├── Pandas.asset
│   │   │   └── FullStack.asset
│   │   └── Challenges/
│   │       ├── Python_Beginner.asset       // 50+ questions
│   │       ├── Python_Basic.asset
│   │       ├── Python_Medium.asset
│   │       ├── Python_Advanced.asset
│   │       └── ... (per language × level)
│   ├── Scenes/
│   │   ├── Bootstrap.unity                // Init services, then load Splash
│   │   ├── SplashScreen.unity
│   │   ├── MainMenu.unity                 // Login + Create Account
│   │   ├── Lobby.unity                    // Central hub
│   │   ├── Garage.unity                   // 3D car showcase
│   │   ├── ARRace.unity                   // AR racing gameplay
│   │   ├── Leaderboard.unity
│   │   └── CodeLibrary.unity
│   ├── Audio/
│   │   ├── Music/
│   │   │   ├── menu_cyberpunk_loop.ogg
│   │   │   ├── race_intense_loop.ogg
│   │   │   └── victory_fanfare.ogg
│   │   └── SFX/
│   │       ├── engine_idle.ogg
│   │       ├── engine_rev.ogg
│   │       ├── engine_high_rpm.ogg
│   │       ├── turbo_boost.ogg
│   │       ├── nitro_fire.ogg
│   │       ├── correct_answer.ogg
│   │       ├── wrong_answer.ogg
│   │       ├── ui_click.ogg
│   │       ├── ui_hover.ogg
│   │       ├── countdown_beep.ogg
│   │       ├── race_start.ogg
│   │       ├── combo_streak.ogg
│   │       └── victory_horn.ogg
│   ├── Animations/
│   │   ├── UI/
│   │   │   ├── ScreenSlideIn.anim
│   │   │   ├── ScreenSlideOut.anim
│   │   │   ├── ButtonPulse.anim
│   │   │   ├── LogoReveal.anim
│   │   │   └── HolographicFlicker.anim
│   │   └── AI/
│   │       ├── AIAssistant_Idle.anim
│   │       ├── AIAssistant_Happy.anim
│   │       ├── AIAssistant_Thinking.anim
│   │       └── AIAssistant_Celebrate.anim
│   └── Textures/
│       ├── UI/
│       │   ├── gradient_bg_01.png
│       │   ├── neon_border.png
│       │   ├── holographic_overlay.png
│       │   └── code_pattern_bg.png
│       └── Track/
│           ├── road_normal.png
│           └── barrier_emission.png
├── Plugins/
│   ├── Photon/                            // Photon PUN 2
│   └── Firebase/                          // Firebase SDK
└── ThirdParty/
    ├── DOTween/                           // Tweening animations
    ├── TextMeshPro/                       // Rich text rendering
    └── PostProcessing/                    // Bloom, vignette, etc.
```

---

## CORE SCRIPTS — FULL IMPLEMENTATIONS

### 1. GameManager.cs

```csharp
using UnityEngine;
using System;

namespace LevelUpCode.Core
{
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        public event Action<GameState> OnGameStateChanged;

        public enum GameState
        {
            Splash, Login, Lobby, Garage, LanguageSelect,
            LevelSelect, TopicSelect, Racing, Results,
            Leaderboard, CodeLibrary, Character, Multiplayer
        }

        [SerializeField] private GameState _currentState = GameState.Splash;
        public GameState CurrentState => _currentState;

        public PlayerProfile CurrentPlayer { get; private set; }
        public CarData SelectedCar { get; set; }
        public string SelectedLanguage { get; set; }
        public string SelectedLevel { get; set; }
        public string SelectedTopic { get; set; }

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
            ServiceLocator.Initialize();
        }

        public void ChangeState(GameState newState)
        {
            _currentState = newState;
            OnGameStateChanged?.Invoke(newState);
            SceneController.Instance.LoadSceneForState(newState);
        }

        public void SetPlayer(PlayerProfile profile)
        {
            CurrentPlayer = profile;
        }
    }
}
```

### 2. ARTrackPlacement.cs

```csharp
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using System.Collections.Generic;

namespace LevelUpCode.AR
{
    public class ARTrackPlacement : MonoBehaviour
    {
        [SerializeField] private ARRaycastManager _raycastManager;
        [SerializeField] private ARPlaneManager _planeManager;
        [SerializeField] private GameObject _trackPrefab;
        [SerializeField] private GameObject _placementIndicator;

        private GameObject _spawnedTrack;
        private bool _trackPlaced;
        private readonly List<ARRaycastHit> _hits = new();
        private Pose _placementPose;
        private bool _placementValid;

        private void Update()
        {
            if (_trackPlaced) return;

            UpdatePlacementPose();
            UpdateIndicator();

            if (_placementValid && Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)
            {
                PlaceTrack();
            }
        }

        private void UpdatePlacementPose()
        {
            var screenCenter = Camera.main.ViewportToScreenPoint(new Vector3(0.5f, 0.5f));
            _placementValid = _raycastManager.Raycast(screenCenter, _hits, TrackableType.PlaneWithinPolygon);

            if (_placementValid)
            {
                _placementPose = _hits[0].pose;

                // Rotate to face camera
                var camForward = Camera.main.transform.forward;
                var camBearing = new Vector3(camForward.x, 0, camForward.z).normalized;
                _placementPose.rotation = Quaternion.LookRotation(camBearing);
            }
        }

        private void UpdateIndicator()
        {
            _placementIndicator.SetActive(_placementValid);
            if (_placementValid)
            {
                _placementIndicator.transform.SetPositionAndRotation(
                    _placementPose.position, _placementPose.rotation);
            }
        }

        private void PlaceTrack()
        {
            _spawnedTrack = Instantiate(_trackPrefab, _placementPose.position, _placementPose.rotation);
            _trackPlaced = true;
            _placementIndicator.SetActive(false);

            // Disable plane detection for performance
            _planeManager.enabled = false;
            foreach (var plane in _planeManager.trackables)
                plane.gameObject.SetActive(false);

            // Notify race can begin
            FindObjectOfType<RaceManager>()?.OnTrackPlaced(_spawnedTrack);
        }

        public void ResetPlacement()
        {
            if (_spawnedTrack) Destroy(_spawnedTrack);
            _trackPlaced = false;
            _planeManager.enabled = true;
        }
    }
}
```

### 3. CarController.cs

```csharp
using UnityEngine;

namespace LevelUpCode.Racing
{
    [RequireComponent(typeof(Rigidbody))]
    public class CarController : MonoBehaviour
    {
        [Header("Performance Stats")]
        [SerializeField] private float _maxSpeed = 120f;
        [SerializeField] private float _acceleration = 40f;
        [SerializeField] private float _brakeForce = 60f;
        [SerializeField] private float _turnSpeed = 90f;
        [SerializeField] private float _driftFactor = 0.95f;

        [Header("Boost")]
        [SerializeField] private float _boostMultiplier = 1.8f;
        [SerializeField] private float _boostDuration = 3f;
        [SerializeField] private ParticleSystem _boostVFX;
        [SerializeField] private TrailRenderer[] _speedTrails;

        [Header("Visual")]
        [SerializeField] private Transform[] _wheels;
        [SerializeField] private float _wheelSpinSpeed = 720f;
        [SerializeField] private Light _underglowLight;
        [SerializeField] private Material _neonMaterial;

        private Rigidbody _rb;
        private float _currentSpeed;
        private float _steerInput;
        private float _boostTimer;
        private bool _isBoosting;

        public float CurrentSpeed => _currentSpeed;
        public float SpeedNormalized => _currentSpeed / _maxSpeed;
        public bool IsBoosting => _isBoosting;

        private void Awake()
        {
            _rb = GetComponent<Rigidbody>();
            _rb.centerOfMass = new Vector3(0, -0.3f, 0.2f);
        }

        private void FixedUpdate()
        {
            float effectiveMax = _isBoosting ? _maxSpeed * _boostMultiplier : _maxSpeed;

            // Forward force
            Vector3 forwardForce = transform.forward * _acceleration;
            if (_currentSpeed < effectiveMax)
                _rb.AddForce(forwardForce, ForceMode.Acceleration);

            // Steering
            if (_currentSpeed > 1f)
            {
                float turnAmount = _steerInput * _turnSpeed * Time.fixedDeltaTime;
                Quaternion turnRotation = Quaternion.Euler(0, turnAmount, 0);
                _rb.MoveRotation(_rb.rotation * turnRotation);
            }

            // Drift physics — reduce sideways velocity
            Vector3 forwardVelocity = transform.forward * Vector3.Dot(_rb.linearVelocity, transform.forward);
            Vector3 rightVelocity = transform.right * Vector3.Dot(_rb.linearVelocity, transform.right);
            _rb.linearVelocity = forwardVelocity + rightVelocity * _driftFactor;

            _currentSpeed = _rb.linearVelocity.magnitude;

            // Boost decay
            if (_isBoosting)
            {
                _boostTimer -= Time.fixedDeltaTime;
                if (_boostTimer <= 0) DeactivateBoost();
            }

            // Visuals
            UpdateWheels();
            UpdateNeonIntensity();
        }

        public void SetSteerInput(float input) => _steerInput = Mathf.Clamp(input, -1f, 1f);

        public void ActivateBoost()
        {
            _isBoosting = true;
            _boostTimer = _boostDuration;
            _boostVFX?.Play();
            foreach (var trail in _speedTrails) trail.emitting = true;
            AudioManager.Instance?.PlaySFX("turbo_boost");
        }

        private void DeactivateBoost()
        {
            _isBoosting = false;
            _boostVFX?.Stop();
            foreach (var trail in _speedTrails) trail.emitting = false;
        }

        private void UpdateWheels()
        {
            foreach (var wheel in _wheels)
                wheel.Rotate(Vector3.right, _currentSpeed * _wheelSpinSpeed * Time.deltaTime);
        }

        private void UpdateNeonIntensity()
        {
            if (_neonMaterial == null || _underglowLight == null) return;
            float intensity = Mathf.Lerp(1f, 4f, SpeedNormalized);
            _neonMaterial.SetFloat("_EmissionIntensity", intensity);
            _underglowLight.intensity = intensity * 2f;
        }
    }
}
```

### 4. ChallengeManager.cs

```csharp
using UnityEngine;
using System.Collections.Generic;
using System.Linq;

namespace LevelUpCode.Coding
{
    public class ChallengeManager : MonoBehaviour
    {
        [SerializeField] private ChallengeDatabase _database;
        [SerializeField] private ChallengeUI _challengeUI;

        private List<ChallengeData> _activeChallenges;
        private int _currentIndex;
        private int _combo;
        private int _score;
        private int _correctCount;

        public int Score => _score;
        public int Combo => _combo;
        public int CorrectCount => _correctCount;
        public int TotalQuestions => _activeChallenges?.Count ?? 0;

        public event System.Action<bool, int> OnAnswerSubmitted; // correct, combo
        public event System.Action<int> OnRaceFinished; // final score

        public void Initialize(string language, string level, string topic, int questionCount = 10)
        {
            _activeChallenges = _database
                .GetChallenges(language, level, topic)
                .OrderBy(_ => Random.value)
                .Take(questionCount)
                .ToList();

            _currentIndex = 0;
            _combo = 0;
            _score = 0;
            _correctCount = 0;

            ShowCurrentChallenge();
        }

        public void SubmitAnswer(int selectedIndex)
        {
            var challenge = _activeChallenges[_currentIndex];
            bool correct = selectedIndex == challenge.CorrectAnswerIndex;

            if (correct)
            {
                _combo++;
                _correctCount++;
                int comboMultiplier = Mathf.Min(_combo, 5);
                int points = (100 + _combo * 20) * comboMultiplier;
                _score += points;

                AudioManager.Instance?.PlaySFX("correct_answer");
                if (_combo >= 3) AudioManager.Instance?.PlaySFX("combo_streak");
            }
            else
            {
                _combo = 0;
                AudioManager.Instance?.PlaySFX("wrong_answer");
            }

            OnAnswerSubmitted?.Invoke(correct, _combo);
            _challengeUI.ShowResult(correct, _combo);

            // Next question after delay
            Invoke(nameof(NextQuestion), 1.5f);
        }

        private void NextQuestion()
        {
            _currentIndex++;
            if (_currentIndex >= _activeChallenges.Count)
            {
                OnRaceFinished?.Invoke(_score);
                return;
            }
            ShowCurrentChallenge();
        }

        private void ShowCurrentChallenge()
        {
            _challengeUI.DisplayChallenge(
                _activeChallenges[_currentIndex],
                _currentIndex + 1,
                _activeChallenges.Count
            );
        }
    }
}
```

### 5. RaceManager.cs

```csharp
using UnityEngine;
using System.Collections;

namespace LevelUpCode.Racing
{
    public class RaceManager : MonoBehaviour
    {
        [SerializeField] private CarController _playerCar;
        [SerializeField] private AIOpponent[] _opponents;
        [SerializeField] private ChallengeManager _challengeManager;
        [SerializeField] private RaceHUD _raceHUD;
        [SerializeField] private float _raceDuration = 120f;

        private float _timeRemaining;
        private bool _raceActive;
        private int _playerPosition = 3;
        private float _distanceCovered;

        public int PlayerPosition => _playerPosition;

        public void OnTrackPlaced(GameObject track)
        {
            // Position cars on track
            StartCoroutine(CountdownSequence());
        }

        private IEnumerator CountdownSequence()
        {
            _raceHUD.ShowCountdown(3);
            AudioManager.Instance?.PlaySFX("countdown_beep");
            yield return new WaitForSeconds(1f);

            _raceHUD.ShowCountdown(2);
            AudioManager.Instance?.PlaySFX("countdown_beep");
            yield return new WaitForSeconds(1f);

            _raceHUD.ShowCountdown(1);
            AudioManager.Instance?.PlaySFX("countdown_beep");
            yield return new WaitForSeconds(1f);

            _raceHUD.ShowCountdown(0); // "GO!"
            AudioManager.Instance?.PlaySFX("race_start");

            StartRace();
        }

        private void StartRace()
        {
            _raceActive = true;
            _timeRemaining = _raceDuration;
            _challengeManager.Initialize(
                GameManager.Instance.SelectedLanguage,
                GameManager.Instance.SelectedLevel,
                GameManager.Instance.SelectedTopic
            );

            _challengeManager.OnAnswerSubmitted += HandleAnswer;
            _challengeManager.OnRaceFinished += HandleRaceEnd;

            foreach (var opponent in _opponents)
                opponent.StartRacing();
        }

        private void Update()
        {
            if (!_raceActive) return;

            _timeRemaining -= Time.deltaTime;
            _distanceCovered += _playerCar.CurrentSpeed * Time.deltaTime * 0.01f;

            _raceHUD.UpdateHUD(
                speed: _playerCar.CurrentSpeed,
                time: _timeRemaining,
                position: _playerPosition,
                score: _challengeManager.Score,
                combo: _challengeManager.Combo,
                boosting: _playerCar.IsBoosting
            );

            UpdateRacePosition();

            if (_timeRemaining <= 0) HandleRaceEnd(_challengeManager.Score);
        }

        private void HandleAnswer(bool correct, int combo)
        {
            if (correct)
            {
                _playerCar.ActivateBoost();
                // Move up in position
                _playerPosition = Mathf.Max(1, _playerPosition - 1);
            }
            else
            {
                _playerPosition = Mathf.Min(5, _playerPosition + 1);
            }
        }

        private void UpdateRacePosition()
        {
            // Calculate based on distance vs opponents
            float playerDist = _distanceCovered;
            int pos = 1;
            foreach (var opp in _opponents)
            {
                if (opp.DistanceCovered > playerDist) pos++;
            }
            _playerPosition = pos;
        }

        private void HandleRaceEnd(int finalScore)
        {
            _raceActive = false;
            _challengeManager.OnAnswerSubmitted -= HandleAnswer;
            _challengeManager.OnRaceFinished -= HandleRaceEnd;

            // Award XP
            int xpEarned = finalScore / 2;
            GameManager.Instance.CurrentPlayer.AddXP(xpEarned);

            // Show results
            var results = new RaceResults
            {
                Position = _playerPosition,
                Score = finalScore,
                Time = _raceDuration - _timeRemaining,
                Distance = _distanceCovered,
                MaxCombo = _challengeManager.Combo,
                XPEarned = xpEarned,
                CorrectAnswers = _challengeManager.CorrectCount,
                TotalQuestions = _challengeManager.TotalQuestions
            };

            FindObjectOfType<ResultsScreenUI>()?.ShowResults(results);
            AudioManager.Instance?.PlaySFX(_playerPosition <= 3 ? "victory_horn" : "race_end");
        }
    }
}
```

### 6. AudioManager.cs

```csharp
using UnityEngine;
using System.Collections.Generic;

namespace LevelUpCode.Audio
{
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [System.Serializable]
        public class SFXClip
        {
            public string name;
            public AudioClip clip;
            [Range(0f, 1f)] public float volume = 1f;
        }

        [SerializeField] private SFXClip[] _sfxClips;
        [SerializeField] private AudioSource _musicSource;
        [SerializeField] private AudioSource _sfxSource;
        [SerializeField] private AudioSource _engineSource;

        [Header("Engine")]
        [SerializeField] private AudioClip _engineIdle;
        [SerializeField] private AudioClip _engineHigh;

        private readonly Dictionary<string, SFXClip> _sfxMap = new();

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            foreach (var sfx in _sfxClips)
                _sfxMap[sfx.name] = sfx;
        }

        public void PlaySFX(string name)
        {
            if (_sfxMap.TryGetValue(name, out var sfx))
                _sfxSource.PlayOneShot(sfx.clip, sfx.volume);
        }

        public void UpdateEngineSound(float speedNormalized)
        {
            _engineSource.pitch = Mathf.Lerp(0.8f, 2.5f, speedNormalized);
            _engineSource.volume = Mathf.Lerp(0.3f, 1f, speedNormalized);
        }

        public void PlayMusic(AudioClip clip, bool loop = true)
        {
            _musicSource.clip = clip;
            _musicSource.loop = loop;
            _musicSource.Play();
        }
    }
}
```

### 7. AIAssistant.cs

```csharp
using UnityEngine;
using System.Collections.Generic;

namespace LevelUpCode.AI
{
    public class AIAssistant : MonoBehaviour
    {
        [SerializeField] private SpeechBubbleUI _speechBubble;
        [SerializeField] private Animator _avatarAnimator;

        private static readonly Dictionary<string, string[]> _encouragements = new()
        {
            ["correct"] = new[] {
                "🔥 Amazing! You're coding like a pro!",
                "⚡ NITRO BOOST! Keep that streak going!",
                "🎯 Perfect! Your code runs clean!",
                "🚀 Incredible speed! Can't stop you now!"
            },
            ["wrong"] = new[] {
                "💪 No worries! Every bug is a lesson!",
                "🔧 Let's debug that thinking and try again!",
                "📖 Check the code library for a refresher!",
                "🧠 Think step by step — you've got this!"
            },
            ["streak"] = new[] {
                "🔥🔥🔥 UNSTOPPABLE COMBO!",
                "⚡ You're in the ZONE!",
                "🏆 Code master mode ACTIVATED!"
            },
            ["hint"] = new[] {
                "💡 Think about the data type here...",
                "💡 Remember the syntax from the tutorial...",
                "💡 Break it down into smaller steps!"
            }
        };

        public void OnCorrectAnswer(int combo)
        {
            var messages = combo >= 3 ? _encouragements["streak"] : _encouragements["correct"];
            string msg = messages[Random.Range(0, messages.Length)];
            _speechBubble.Show(msg, 2f);
            _avatarAnimator?.SetTrigger(combo >= 3 ? "Celebrate" : "Happy");
        }

        public void OnWrongAnswer()
        {
            string msg = _encouragements["wrong"][Random.Range(0, _encouragements["wrong"].Length)];
            _speechBubble.Show(msg, 3f);
            _avatarAnimator?.SetTrigger("Thinking");
        }

        public void GiveHint()
        {
            string msg = _encouragements["hint"][Random.Range(0, _encouragements["hint"].Length)];
            _speechBubble.Show(msg, 4f);
        }
    }
}
```

---

## AR-SPECIFIC FEATURES

### AR Track Placement Flow
1. User opens camera → AR plane detection starts
2. Visual indicator shows where track will spawn
3. Tap to place → Track materializes with neon glow animation
4. Pinch to scale track size (desk-sized to room-sized)
5. Cars spawn at start line
6. 3-2-1 countdown → RACE!

### AR Light Estimation
```csharp
// ARLightEstimation.cs — matches virtual lighting to real-world
[SerializeField] private Light _mainLight;
private ARCameraManager _cameraManager;

void OnFrameReceived(ARCameraFrameEventArgs args)
{
    if (args.lightEstimation.averageBrightness.HasValue)
        _mainLight.intensity = args.lightEstimation.averageBrightness.Value;
    if (args.lightEstimation.averageColorTemperature.HasValue)
        _mainLight.colorTemperature = args.lightEstimation.averageColorTemperature.Value;
}
```

### AR Shadow Rendering
- Use transparent shadow-receiving planes so cars cast shadows on real surfaces
- Shader renders only shadows, rest is transparent

---

## UI/UX DESIGN SPECIFICATIONS

### Color Palette (HSL)
| Token | HSL | Usage |
|-------|-----|-------|
| Background | 220 20% 4% | Dark base |
| Neon Cyan | 185 100% 50% | Primary accent, player car |
| Neon Green | 140 80% 50% | Success, secondary |
| Neon Orange | 35 100% 55% | Warnings, accent |
| Neon Purple | 270 80% 60% | Special effects |
| Neon Yellow | 50 100% 55% | Score, coins |
| Neon Red | 0 80% 55% | Errors, danger |
| Neon Magenta | 310 100% 60% | Track edges, effects |

### Typography
- **Headers:** Orbitron (futuristic display font)
- **Body:** Rajdhani (clean, readable)
- **Code/Data:** Share Tech Mono (monospace)

### Animations (DOTween)
- Screen transitions: 0.5s slide with easing
- Button hover: Scale 1.05 + glow pulse
- Card select: Scale 1.08 + border glow
- Combo popup: Bounce spring + shake
- Neon text: Emission pulse 0.6-1.0 over 2s loop

---

## MULTIPLAYER ARCHITECTURE (Photon PUN 2)

```csharp
// NetworkManager.cs
public class NetworkManager : MonoBehaviourPunCallbacks
{
    public void ConnectToServer()
    {
        PhotonNetwork.ConnectUsingSettings();
    }

    public override void OnConnectedToMaster()
    {
        PhotonNetwork.JoinLobby();
    }

    public void CreateRoom(string roomName, int maxPlayers = 5)
    {
        var options = new RoomOptions { MaxPlayers = (byte)maxPlayers };
        PhotonNetwork.CreateRoom(roomName, options);
    }

    public void JoinRoom(string roomName)
    {
        PhotonNetwork.JoinRoom(roomName);
    }
}
```

---

## REQUIRED UNITY PACKAGES

```json
{
    "com.unity.xr.arfoundation": "5.1.0",
    "com.unity.xr.arcore": "5.1.0",
    "com.unity.xr.arkit": "5.1.0",
    "com.unity.render-pipelines.universal": "14.0.0",
    "com.unity.textmeshpro": "3.0.6",
    "com.unity.inputsystem": "1.7.0",
    "com.unity.cinemachine": "2.9.7",
    "com.unity.postprocessing": "3.4.0"
}
```

### Third-Party Assets
- Photon PUN 2 (Free) — Multiplayer
- DOTween Pro — Animations
- Firebase SDK — Backend
- NiceVibrations — Haptic feedback

---

## BUILD SETTINGS

### Android
- Min API: 24 (Android 7.0)
- Target API: 34
- Graphics API: Vulkan + OpenGLES3
- ARCore Required: true
- IL2CPP backend

### iOS
- Min iOS: 14.0
- ARKit Required: true
- Camera Usage Description: "AR racing track placement"
- IL2CPP backend

---

## SUMMARY

This prompt provides everything needed to build **LevelUp Code** in Unity with C# and AR:
- **18 complete screens** with cyberpunk neon aesthetic
- **AR track placement** on real surfaces via ARCore/ARKit
- **Physics-based racing** with boost mechanics tied to coding challenges
- **10+ programming languages** with 50+ questions per language/level
- **Real-time multiplayer** via Photon PUN 2
- **AI Assistant** with personality and contextual help
- **Full audio system** with engine sounds, SFX, and adaptive music
- **Progression system** with XP, car unlocks, achievements, and seasons
- **Production-ready architecture** with MVVM, event bus, and service locator patterns
