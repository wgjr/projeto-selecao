import { useAuthCheck } from '../hooks/useAuthCheck';

export default function AuthProvider({ children }) {
    useAuthCheck();
    return children;
}