import { LoadFacebookUserApi } from '@/data/contracts/apis'

import { mock } from 'jest-mock-extended'

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string
    params: object
  }
}

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
