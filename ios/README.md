# iOS App

SwiftUI app, MVVM, async/await networking against the FastAPI backend.

```
ExpenseTracker/Sources/
├── Domain/        # Models + repository protocols (no framework deps)
├── Data/          # APIClient, DTOs, repository implementations
├── Presentation/  # SwiftUI Views + ViewModels
└── App/           # @main entry point, composition root
```

The `.xcodeproj` is **generated, not committed** — `project.yml` is the source
of truth. Regenerate any time you change `project.yml` (adding new files under
`Sources/` does *not* require regenerating).

## One-time setup

1. Install Xcode from the Mac App Store (requires your Apple ID).
2. Install XcodeGen: `brew install xcodegen` (already done if you're reading
   this after Step 4).
3. Generate the project:
   ```bash
   cd ios
   xcodegen generate
   open ExpenseTracker.xcodeproj
   ```
4. In Xcode, select the `ExpenseTracker` target → **Signing & Capabilities** →
   set **Team** to your personal Apple ID. Xcode will manage a free
   provisioning profile automatically.

## Running on your iPhone

1. Start the backend: `docker compose up -d` from the repo root.
2. Find your Mac's LAN IP (System Settings → Wi-Fi → Details, or
   `ipconfig getifaddr en0` in Terminal).
3. Update `APIConfiguration.baseURL` in
   `ExpenseTracker/Sources/Data/Networking/APIConfiguration.swift` to
   `http://<your-mac-ip>:8000` (the Simulator can use `localhost`, but a
   physical iPhone cannot — it isn't the same machine).
4. Plug in your iPhone, select it as the run destination in Xcode, and press
   Run (⌘R).
5. First launch only: on the iPhone, go to **Settings → General → VPN &
   Device Management** and trust your developer certificate — iOS blocks
   apps signed with a free/personal certificate until you do this once.
6. You may also see an iOS prompt asking to allow the app to find devices on
   your local network — allow it; this is expected since the app talks to
   your Mac over Wi-Fi.

## Why `NSAllowsLocalNetworking`

The backend runs over plain HTTP on your local network (no TLS in dev). Apple
requires apps to justify any non-HTTPS connection via App Transport Security
(ATS). Rather than disabling ATS globally (`NSAllowsArbitraryLoads`), the
`Info.plist` (declared in `project.yml`) sets the narrower
`NSAllowsLocalNetworking`, which permits HTTP only to local/private network
addresses — public internet requests still require HTTPS.
