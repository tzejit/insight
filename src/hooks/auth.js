import { useEffect, useState } from 'react';

function useAuth() {

    const [payload, setPayload] = useState('')
    const [authed, setAuthed] = useState(false)
    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem('jwt-token')
            let res = await fetch('http://127.0.0.1:5000/auth_api', {
            headers: {
                'jwt-token': token,
            },
            })

            setAuthed(res.status === 200)
        
            res = await res.json() 
            setPayload(res)
        }

        fetchData()

      }, [])

    return [authed, payload]
}

export default useAuth
