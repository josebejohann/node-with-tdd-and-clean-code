import { HttpGetClient } from '@/infra/http'

import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get (params: HttpGetClient.Params): Promise<HttpGetClient.Result> {
    const { data } = await axios.get(params.url, { params: params.params })

    return data
  }
}

type SutTypes = {
  sut: AxiosHttpClient
  fakeAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const fakeAxios = axios as jest.Mocked<typeof axios>
  fakeAxios.get.mockResolvedValue({
    status: 200,
    data: 'any_data'
  })

  const sut = new AxiosHttpClient()

  return {
    sut,
    fakeAxios
  }
}

describe('AxiosHttpClient', () => {
  const url = 'any_url'
  const params = { any: 'any' }

  it('should call get with correct params', async () => {
    const { sut, fakeAxios } = makeSut()

    await sut.get({ url, params })

    expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
    expect(fakeAxios.get).toHaveBeenCalledTimes(1)
  })

  it('should return data on success', async () => {
    const { sut } = makeSut()

    const result = await sut.get({ url, params })

    expect(result).toEqual('any_data')
  })
})
