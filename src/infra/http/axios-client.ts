import { HttpGetClient } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get (params: HttpGetClient.Params): Promise<HttpGetClient.Result> {
    const { data } = await axios.get(params.url, { params: params.params })

    return data
  }
}
