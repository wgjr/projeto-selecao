import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

/**
 * @param {'success' | 'info' | 'warning' | 'error'} type - The type of alert.
 * @param {string} message - The message to display inside the alert.
 */
export default function showAlert(type, message) {
    const titleMap = {
        success: 'Success',
        info: 'Info',
        warning: 'Warning',
        error: 'Error'
    };

    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity={type}>
                <AlertTitle>{titleMap[type]}</AlertTitle>
                {message}
            </Alert>
        </Stack>
    );
}
