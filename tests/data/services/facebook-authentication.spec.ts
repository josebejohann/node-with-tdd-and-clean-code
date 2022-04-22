import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'

import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

type SutTypes = {
  sut: FacebookAuthenticationService
  facebookApi: MockProxy<LoadFacebookUserApi>
  userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
}

const makeSut = (): SutTypes => {
  const facebookApi = mock<LoadFacebookUserApi>()
  facebookApi.loadUser.mockResolvedValue({
    facebookId: 'any_facebook_id',
    email: 'any_facebook_email',
    name: 'any_facebook_name'
  })

  const userAccountRepository = mock<LoadUserAccountRepository & SaveFacebookAccountRepository>()
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

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const { sut, userAccountRepository } = makeSut()

    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut.perform({ token })

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})
