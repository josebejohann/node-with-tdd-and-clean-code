import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  facebookApi: MockProxy<LoadFacebookUserApi>
  userAccountRepository: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository>
}

const makeSut = (): SutTypes => {
  const facebookApi = mock<LoadFacebookUserApi>()
  facebookApi.loadUser.mockResolvedValue({
    facebookId: 'any_facebook_id',
    email: 'any_facebook_email',
    name: 'any_facebook_name'
  })

  const userAccountRepository = mock<LoadUserAccountRepository & CreateFacebookAccountRepository>()

  const sut = new FacebookAuthenticationService(
    facebookApi,
    userAccountRepository
  )

  return {
    sut,
    facebookApi,
    userAccountRepository
  }
}

describe('FacebookAuthenticationService', () => {
  const token = 'any_token'

  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, facebookApi } = makeSut()

    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, facebookApi } = makeSut()

    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    const { sut, userAccountRepository } = makeSut()

    await sut.perform({ token })

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    const { sut, userAccountRepository } = makeSut()

    userAccountRepository.load.mockResolvedValueOnce(undefined)

    await sut.perform({ token })

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      facebookId: 'any_facebook_id',
      email: 'any_facebook_email',
      name: 'any_facebook_name'
    })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
