import Foundation
import Security

struct Credentials {
    let username: String
    let password: String
}

/// Keychain-backed storage for the shared Basic Auth credentials — a
/// password is a real secret, unlike the LAN backend URL override, so it
/// doesn't belong in UserDefaults.
enum CredentialsStore {
    private static let service = "com.carlosmts.expensetracker.auth"
    private static let account = "sharedCredentials"

    private struct StoredCredentials: Codable {
        let username: String
        let password: String
    }

    static func load() -> Credentials? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        guard status == errSecSuccess,
            let data = result as? Data,
            let decoded = try? JSONDecoder().decode(StoredCredentials.self, from: data)
        else {
            return nil
        }
        return Credentials(username: decoded.username, password: decoded.password)
    }

    static func save(_ credentials: Credentials) {
        clear()
        guard
            let encoded = try? JSONEncoder().encode(
                StoredCredentials(username: credentials.username, password: credentials.password)
            )
        else {
            return
        }
        let attributes: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecValueData as String: encoded,
        ]
        SecItemAdd(attributes as CFDictionary, nil)
    }

    static func clear() {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
        SecItemDelete(query as CFDictionary)
    }
}
