struct CategoryResponseDTO: Decodable {
    let id: Int
    let name: String
}

extension CategoryResponseDTO {
    func toDomain() -> Category {
        Category(id: id, name: name)
    }
}

struct CategoryRenameRequestDTO: Encodable {
    let name: String
}
