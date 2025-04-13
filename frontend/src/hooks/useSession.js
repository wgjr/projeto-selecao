import { useSelector } from 'react-redux';
import {selectSession} from "../redux/authSlice";

export const useSession = () => {
    const { token, email } = useSelector(selectSession);

    const hasSession = () => {
        return !!(token && email);
    };

    return { hasSession };
};