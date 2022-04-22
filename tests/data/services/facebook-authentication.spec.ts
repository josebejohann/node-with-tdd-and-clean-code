import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>
}

const makeSut = (): SutTypes => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>()
  loadFacebookUserApi.loadUser.mockResolvedValue({
    facebookId: 'any_facebook_id',
    email: 'any_facebook_email',
    name: 'any_facebook_name'
  })

  const loadUserAccountRepository = mock<LoadUserAccountRepository>()

  const createFacebookAccountRepository = mock<CreateFacebookAccountRepository>()

  const sut = new FacebookAuthenticationService(
    loadFacebookUserApi,
    loadUserAccountRepository,
    createFacebookAccountRepository
  )

  return {
    sut,
    loadFacebookUserApi,
    loadUserAccountRepository,
    createFacebookAccountRepository
  }
}

describe('FacebookAuthenticationService', () => {
  const token = 'any_token'

  it('should call LoadFacebookUserApi with correct params', async () => {
    const { sut, loadFacebookUserApi } = makeSut()

    await sut.perform({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const { sut, loadFacebookUserApi } = makeSut()

    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    const { sut, loadUserAccountRepository } = makeSut()

    await sut.perform({ token })

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_email' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    const { sut, loadUserAccountRepository, createFacebookAccountRepository } = makeSut()

    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)

    await sut.perform({ token })

    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      facebookId: 'any_facebook_id',
      email: 'any_facebook_email',
      name: 'any_facebook_name'
    })
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
