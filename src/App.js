import './App.css';
import React, { useState } from 'react'
import Card from './Card';

const static_content = [];

function App() {
    const [link, setLink] = useState('');
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [anime, setAnime] = useState(static_content);
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(true);
    const [initialLoad,setInitialLoad]=useState(true);
    const queryChangeHandler = (event) => {
        setQuery(event.target.value);
        setLink(getLink(event.target.value, page));
    };

    const getLink = (query_value, page_value) => {
        return `https://api.jikan.moe/v3/search/anime?q=${query_value}&limit=16&page=${page_value}`;
    }

    const apiCall = async () => {
        setLoading(true);
        setAnime([]);
        await fetch(link, { method: 'GET' }).then(response => {
            if (response.ok){setError(null);return response.json();}
            else throw Error("Couldn't fetch the data for that search result");
        }).then(data => { setInitialLoad(false);setLoading(false);setAnime(data.results) })
        .catch(err=>{setAnime([]);setError("Sorry, Couldn't fetch the data for that search result.")});
    };

    const load = async () => {
        setLoading(true);
        setPage(prev_page => prev_page + 1);
        setLink(getLink(query, page + 1));
        await fetch(getLink(query, page + 1), { method: 'GET' }).then(response => {
            if (response.ok){setError(null);return response.json();}
            else throw Error("No more results available.");
        }).then(data => { setLoading(false);setAnime(prev_anime => { console.log(data.results[0]);return [...prev_anime, ...data.results]; }) })
        .catch(err=>setError("No more results available."));
    };

    return (
        <div className="App text-white">
            <div className="form-inline d-flex justify-content-center m-5">
                <div className="input-group form-group">
                    <input type="search" value={query} onChange={queryChangeHandler} className="form-control form-outline" placeholder="Search" />
                    <button type="submit" onClick={apiCall} className="btn btn-primary rounded-0"><i className="fas fa-search"></i></button>
                </div>
            </div>
            <p className="text-muted">Requesting: {link}</p>
            <div className="container">
                <div className="row d-flex justify-content-around">
                    {!initialLoad && !error && loading && <p>Loading...</p>}
                    {error && <div className="display-1" >{error}</div>}
                    {typeof anime !== 'undefined' && anime.map(element => <Card title={element.title} src={element.image_url} synopsis={element.synopsis} key={element.mal_id} />)}
                </div>
                {!initialLoad && !loading && !error && <button type="button" className="btn btn-link text-primary" onClick={load}>(load more...)</button>}
            </div>
        </div>
    );
}

export default App;
