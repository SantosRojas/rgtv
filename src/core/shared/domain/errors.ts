export class DomainError extends Error {
  readonly code: string

  constructor(
    message: string,
    code: string,
  ) {
    super(message)
    this.name = 'DomainError'
    this.code = code
  }
}

export class ParseError extends DomainError {
  constructor(message: string) {
    super(message, 'PARSE_ERROR')
    this.name = 'ParseError'
  }
}

export class StorageError extends DomainError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR')
    this.name = 'StorageError'
  }
}

export class PlaybackError extends DomainError {
  constructor(message: string) {
    super(message, 'PLAYBACK_ERROR')
    this.name = 'PlaybackError'
  }
}
