import './App.css';
import React, { useState } from 'react'
import Particles from 'react-tsparticles'
import Card from './Card';
import bg from './bg.jpg';

const static_content = [];

function App() {
    const [link, setLink] = useState('');
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [anime, setAnime] = useState(static_content);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const queryChangeHandler = (event) => {
        setQuery(event.target.value);
        setLink(getLink(event.target.value, page));
    };
    // https://api.jikan.moe/v3/search/anime?q=naruto&limit=16&page=1
    const getLink = (query_value, page_value) => {
        return `https://api.jikan.moe/v3/search/anime?q=${query_value}&limit=16&page=${page_value}`;
    }

    const apiCall = async () => {
        setLoading(true);
        setAnime([]);
        await fetch(link, { method: 'GET' }).then(response => {
            if (response.ok) { setError(null); return response.json(); }
            else throw Error("Couldn't fetch the data for that search result");
        }).then(data => { setInitialLoad(false); setLoading(false); setAnime(data.results); console.log(data); })
            .catch(err => { setAnime([]); setError("Sorry, Couldn't fetch the data for that search result.") });
    };

    const load = async () => {
        setLoading(true);
        setPage(prev_page => prev_page + 1);
        setLink(getLink(query, page + 1));
        await fetch(getLink(query, page + 1), { method: 'GET' }).then(response => {
            if (response.ok) { setError(null); return response.json(); }
            else throw Error("No more results available.");
        }).then(data => { setLoading(false); setAnime(prev_anime => { console.log(data.results[0]); return [...prev_anime, ...data.results]; }) })
            .catch(err => setError("No more results available."));
    };

    const particlesInit = (main) => {
        console.log(main);

        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    };

    const particlesLoaded = (container) => {
        console.log(container);
    };

    return (
        <>
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                    background:bg,
                    // background: {
                    //     color: {
                    //         value: "#8a0321",
                    //     },
                    // },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: "push",
                            },
                            onHover: {
                                enable: true,
                                mode: "repulse",
                            },
                            resize: true,
                        },
                        modes: {
                            bubble: {
                                distance: 400,
                                duration: 2,
                                opacity: 0.8,
                                size: 40,
                            },
                            push: {
                                quantity: 4,
                            },
                            repulse: {
                                distance: 200,
                                duration: 0.4,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: "#ffffff",
                        },
                        links: {
                            color: "#ffffff",
                            distance: 150,
                            enable: true,
                            opacity: 0.5,
                            width: 0,
                        },
                        collisions: {
                            enable: true,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outMode: "bounce",
                            random: false,
                            speed: 6,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: 80,
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            random: true,
                            value: 5,
                        },
                    },
                    detectRetina: true,
                }}
            />
            <div className="App text-white">
                <div className="form-inline d-flex justify-content-center m-5">
                    <div className="input-group form-group">
                        <input type="search" value={query} onChange={queryChangeHandler} className="form-control form-outline" placeholder="Search" />
                        <button type="submit" onClick={apiCall} className="btn btn-primary rounded-0"><i className="fas fa-search"></i></button>
                    </div>
                </div>
                <p className="text-white">Requesting: {link}</p>
                <div className="container">
                    <div className="row d-flex justify-content-around">
                        {!initialLoad && !error && loading && <p>Loading...</p>}
                        {error && <div className="display-1" >{error}</div>}
                        {typeof anime !== 'undefined' && anime.map(element => <Card title={element.title} src={element.image_url} synopsis={element.synopsis} url={element.url} key={element.mal_id} />)}
                    </div>
                    {!initialLoad && !loading && !error && <button type="button" className="btn btn-link text-primary" onClick={load}>(load more...)</button>}
                </div>
            </div>

        </>
    );
}

export default App;
