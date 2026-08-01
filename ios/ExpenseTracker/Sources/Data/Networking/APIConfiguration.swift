import Foundation

enum APIConfiguration {
    private static let overrideKey = "backendBaseURLOverride"

    /// The default FastAPI backend base URL, baked into the app — the
    /// production Render deployment, so the app works anywhere, not just on
    /// the home network. Override via Settings (e.g. to a LAN IP) when
    /// pointing at a local Docker Compose backend for development.
    static let defaultBaseURL = URL(string: "https://claude-personal-expenses.onrender.com")!

    /// The effective base URL: a user-set override from Settings if present,
    /// otherwise `defaultBaseURL`. Read fresh on every access so a change in
    /// Settings takes effect immediately, without restarting the app.
    static var baseURL: URL {
        if let stored = UserDefaults.standard.string(forKey: overrideKey), let url = URL(string: stored) {
            return url
        }
        return defaultBaseURL
    }

    static func setOverride(_ url: URL?) {
        if let url {
            UserDefaults.standard.set(url.absoluteString, forKey: overrideKey)
        } else {
            UserDefaults.standard.removeObject(forKey: overrideKey)
        }
    }
}
