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
  const httpClient = mock<HttpGetClient>()
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'

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
})
