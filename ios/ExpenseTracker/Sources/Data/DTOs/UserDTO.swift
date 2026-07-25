struct UserResponseDTO: Decodable {
    let id: Int
    let name: String
}

extension UserResponseDTO {
    func toDomain() -> User {
        User(id: id, name: name)
    }
}
