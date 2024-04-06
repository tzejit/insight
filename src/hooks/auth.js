import { useEffect, useState } from 'react';
import userpool from '../components/userpool';

function useAuth() {

    const [payload, setPayload] = useState('')
    const [authed, setAuthed] = useState(false)
    const [uuid, setUuid] = useState('')
    useEffect(() => {
        let user = userpool.getCurrentUser();

        if (user) {
            setAuthed(true)
            setPayload(user)
            user.getSession((err, session) => {
                const attributes = session.getIdToken().payload;
                const sub = attributes.sub;
                setUuid(sub)
            });
        }
    }, []);
    return [authed, payload, uuid]
}

export default useAuth
