import {useContext} from 'react'
import {UserContext} from '../../pages/_app'

export const useAuth = () => {
    const { accessToken, refreshToken, userId } = useContext(UserContext)
    return { accessToken, refreshToken, userId }
}
