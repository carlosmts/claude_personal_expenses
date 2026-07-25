import Foundation

enum APIError: Error, LocalizedError {
    case invalidResponse
    case decodingFailed(Error)
    case server(statusCode: Int, message: String)
    case network(Error)

    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "The server returned an unexpected response."
        case .decodingFailed:
            return "Failed to read the server's response."
        case let .server(statusCode, message):
            return "Server error (\(statusCode)): \(message)"
        case let .network(error):
            return error.localizedDescription
        }
    }
}

/// Raised when mapping a DTO field into a stricter domain type fails
/// (e.g. an unrecognized enum raw value, or a malformed decimal string).
enum MappingError: Error, LocalizedError {
    case invalidValue(field: String, value: String)

    var errorDescription: String? {
        switch self {
        case let .invalidValue(field, value):
            return "Invalid value for \(field): \(value)"
        }
    }
}
