export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<void>
}

export namespace CreateFacebookAccountRepository {
  export type Params = {
    facebookId: string
    email: string
    name: string
  }
}

export interface UpdateFacebookAccountRepository {
  updateWithFacebook: (params: UpdateFacebookAccountRepository.Params) => Promise<void>
}

export namespace UpdateFacebookAccountRepository {
  export type Params = {
    facebookId: string
    id: string
    name: string
  }
}
