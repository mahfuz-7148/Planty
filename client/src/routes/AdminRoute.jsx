import {Navigate} from 'react-router';
import LoadingSpinner from '../components/Shared/LoadingSpinner.jsx';
import {useRole} from '../hooks/useRole.jsx';

export const AdminRoute = ({children}) => {
    const [role, isRoleLoading] = useRole()
    if (isRoleLoading) return <LoadingSpinner />
    if (role === 'admin') return children
    return <Navigate to='/' replace='true' />
}