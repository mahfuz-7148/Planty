import axios from 'axios';

export const saveUserInDb = async user => {
    const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/user`, user)
    console.log(data)
}