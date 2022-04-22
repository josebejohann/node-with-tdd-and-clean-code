import { FacebookAccount } from '@/domain/models'

describe('FacebookAccount', () => {
  const facebookData = {
    name: 'any_facebook_name',
    email: 'any_facebook_email',
    facebookId: 'any_facebook_id'
  }

  it('should create with Facebook data only', () => {
    const sut = new FacebookAccount(facebookData)

    expect(sut).toEqual({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
  })

  it('should update name if it is empty', () => {
    const accountData = { id: 'any_id' }

    const sut = new FacebookAccount(facebookData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
  })

  it('should not update name if it is not empty', () => {
    const accountData = { id: 'any_id', name: 'any_name' }

    const sut = new FacebookAccount(facebookData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id'
    })
  })
})
