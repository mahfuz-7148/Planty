import useAuth from './useAuth.js';
import {useQuery} from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure.jsx';
// import {useEffect, useState} from 'react';

export const useRole = () => {
    const {user, loading} = useAuth()
    const axiosSecure = useAxiosSecure()
    const email = user?.email
    const {data: role, isLoading: isRoleLoading} = useQuery({
        queryKey: ['role', email],
        enabled: !loading && !!email,
        queryFn: async () => {
            const {data} = await axiosSecure.get(`/user/role/${email}`)
            return data
        }
    })
    // console.log(role)


    // const [role, setRole] = useState(null)
    // const [isRoleLoading, setIsRoleLoading] = useState(true)
    // useEffect(() => {
    //     const fetchUserRole = async () => {
    //         if (!user) return setIsRoleLoading(false)
    //         try {
    //             const {data} = await axiosSecure.get(`/user/role/${user?.email}`)
    //             setRole(data?.role)
    //         }
    //         catch (error) {
    //             console.log(error)
    //         }
    //         finally {
    //             setIsRoleLoading(false)
    //         }
    //     }
    //     fetchUserRole()
    // }, [user, axiosSecure]);
    return [role?.role, isRoleLoading]
}