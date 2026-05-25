// hooks/useFetch.js
import { useState, useEffect, useRef } from 'react';

export function useFetch(url, options = {}) {
    const [state, setState] = useState({ data: null, loading: true,error: null });
    const abortRef = useRef(null);

    useEffect(() => {
    if (!url) return;
    abortRef.current?.abort(); // anuluj poprzednie zadanie
    abortRef.current = new AbortController();

    setState({ data: null, loading: true, error: null });

    fetch(url, { ...options, signal: abortRef.current.signal })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => setState({ data, loading: false, error: null })
        )
        .catch(err => {
        if (err.name !== 'AbortError')
            setState({ data: null, loading: false, error: err.message
            });
        });
        return () => abortRef.current?.abort();
    }, [url]);
    return state;
}