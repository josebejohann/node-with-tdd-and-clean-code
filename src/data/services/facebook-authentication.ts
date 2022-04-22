import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params)

    if (facebookData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email })

      await this.userAccountRepository.saveWithFacebook({
        facebookId: facebookData.facebookId,
        id: accountData?.id,
        name: accountData?.name ?? facebookData.name,
        email: facebookData.email
      })
    }

    return new AuthenticationError()
  }
}
