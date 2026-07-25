import Foundation

enum APIConfiguration {
    private static let overrideKey = "backendBaseURLOverride"

    /// The default FastAPI backend base URL, baked into the app.
    ///
    /// On the Simulator, "localhost" resolves to your Mac, so the Docker Compose
    /// backend is reachable directly. On a physical iPhone, "localhost" refers to
    /// the phone itself — replace this with your Mac's LAN IP (e.g.
    /// "http://192.168.1.23:8000") while running the backend locally.
    static let defaultBaseURL = URL(string: "http://192.168.1.179:8000")!

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
