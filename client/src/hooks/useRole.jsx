import useAuth from './useAuth.js';
import useAxiosSecure from './useAxiosSecure.jsx';
import {useEffect, useState} from 'react';

export const useRole = () => {
    const {user} = useAuth()
    const axiosSecure = useAxiosSecure()
    const [role, setRole] = useState(null)
    const [isRoleLoading, setIsRoleLoading] = useState(true)
    useEffect(() => {
        const fetchUserRole = async () => {
            const {data} = await axiosSecure.get(`/user/role/${user?.email}`)

            setRole(data?.role)
            setIsRoleLoading(false)
        }
        fetchUserRole()
    }, [user, axiosSecure]);
    return [role, isRoleLoading]
}