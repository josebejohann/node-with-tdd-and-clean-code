import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  facebookApi: MockProxy<LoadFacebookUserApi>
  userAccountRepository: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>
}

const makeSut = (): SutTypes => {
  const facebookApi = mock<LoadFacebookUserApi>()
  facebookApi.loadUser.mockResolvedValue({
    facebookId: 'any_facebook_id',
    email: 'any_facebook_email',
    name: 'any_facebook_name'
  })

  const userAccountRepository = mock<LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository>()
  userAccountRepository.load.mockResolvedValue(undefined)

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

  it('should call CreateFacebookAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    const { sut, userAccountRepository } = makeSut()

    await sut.perform({ token })

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      facebookId: 'any_facebook_id',
      email: 'any_facebook_email',
      name: 'any_facebook_name'
    })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateFacebookAccountRepository when LoadUserAccountRepository returns data', async () => {
    const { sut, userAccountRepository } = makeSut()

    userAccountRepository.load.mockResolvedValue({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token })

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      facebookId: 'any_facebook_id',
      id: 'any_id',
      name: 'any_name'
    })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    const { sut, userAccountRepository } = makeSut()

    userAccountRepository.load.mockResolvedValue({
      id: 'any_id'
    })

    await sut.perform({ token })

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      facebookId: 'any_facebook_id',
      id: 'any_id',
      name: 'any_facebook_name'
    })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
