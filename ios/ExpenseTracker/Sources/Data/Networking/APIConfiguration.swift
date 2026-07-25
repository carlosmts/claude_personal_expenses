import Foundation

enum APIConfiguration {
    /// The FastAPI backend's base URL.
    ///
    /// On the Simulator, "localhost" resolves to your Mac, so the Docker Compose
    /// backend is reachable directly. On a physical iPhone, "localhost" refers to
    /// the phone itself — replace this with your Mac's LAN IP (e.g.
    /// "http://192.168.1.23:8000") while running the backend locally.
    static let baseURL = URL(string: "http://192.168.1.179:8000")!
}
