import { useEffect, useState } from 'react';
import userpool from '../components/userpool';

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function useAuth() {

    const [payload, setPayload] = useState('')
    const [authed, setAuthed] = useState(false)
    const [uuid, setUuid] = useState('')
    useEffect(() => {
        let user = userpool.getCurrentUser();
        console.log(user)
        if (user) {
            setAuthed(true)
            setPayload(user)
            setUuid(parseJwt(user.pool.storage['jwt-token']).uuid)
        }
    }, []);
    return [authed, payload, uuid]
}

export default useAuth
