import { HttpGetClient } from '@/infra/http'
import { FacebookApi } from '@/infra/apis'

import { mock } from 'jest-mock-extended'

type SutTypes = {
  sut: FacebookApi
  httpClient: HttpGetClient
  clientId: string
  clientSecret: string
}

const makeSut = (): SutTypes => {
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'

  const httpClient = mock<HttpGetClient>()
  httpClient.get.mockResolvedValueOnce({ access_token: 'any_app_token' })

  const sut = new FacebookApi(
    httpClient,
    clientId,
    clientSecret
  )

  return {
    sut,
    httpClient,
    clientId,
    clientSecret
  }
}

describe('FacebookApi', () => {
  it('should get app token', async () => {
    const { sut, httpClient, clientId, clientSecret } = makeSut()

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    })
  })

  it('should get debug token', async () => {
    const { sut, httpClient } = makeSut()

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })
})
