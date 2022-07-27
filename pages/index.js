import styles from '../styles/Home.module.scss'
import {fetchBeersPage} from "../store/api";
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import {store} from "../store";
import {getBeers} from "../store/actions";
import {useRouter} from "next/router";
import Image from "next/image";

export const getServerSideProps = async () => {
    const pageData = await fetchBeersPage(1)
    return {
        props: {
            pageData
        }
    }
}



export default function Home({pageData}) {

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        scrollContainer.addEventListener('scroll', scrollHandler);
        return function () {
            scrollContainer.removeEventListener('scroll', scrollHandler);
        }
    }, [])

    const PAGE_SIZE = 25;
    const MAX_DESCRIPTION_LENGTH = 140;
    const LOAD_MORE_THRESHOLD = 700;
    const router = useRouter();
    const scrollContainerRef = useRef(null);
    const [page, setPage] = useState(2);
    const [beers, setBeers] = useState(pageData);
    const [fetching, setFetching] = useState(false);
    const [allLoaded, setAllLoaded] = useState(false);
    const [beerName, setBeerName] = useState('')



    useEffect(() => {
        if (window.innerWidth > 1600) {
            setFetching(true)
        }
    },[])
    const scrollHandler = (e) => {
        const height = e.currentTarget.offsetHeight;
        const contentHeight = e.currentTarget.scrollHeight;
        const scroll = e.currentTarget.scrollTop;

        if (contentHeight - scroll - height < LOAD_MORE_THRESHOLD  ) {

            setFetching(true)

        }
    }

    useEffect(() => {
        if (fetching && !allLoaded) {
            setPage(prevState => prevState + 1)

            axios.get(`https://api.punkapi.com/v2/beers?page=${page}&per_page=${PAGE_SIZE}`)
                .then(response => {
                    if (response.data < PAGE_SIZE) {
                        setAllLoaded(true)
                    }
                    setBeers(prevState => prevState.concat(response.data))
                })
                .finally(() => {
                    setFetching(false)
                })
            setFetching(false)
        }
    }, [fetching, page, allLoaded])



    const descriptionCheck = (i) => {
        if (i.description.length >= MAX_DESCRIPTION_LENGTH) {
            return i.description.slice(0, MAX_DESCRIPTION_LENGTH - 3) + '...'
        }
        return i.description
    }
    const changeBeerName = function (evt) {
        setBeerName(evt.target.value)
    }

    const sort = function () {
        if (beerName !== '') {
            return beers.filter(a => a.name.toLowerCase().includes(beerName)).sort((a,b) => a.name.includes(beerName) - b.name.includes(beerName) )
        }
    }


    const render = function () {
        if (beerName !== '') {
            return (
                sort().map(i => {
                    return (

                        <div key={i.id}  className={styles.beercard} onClick={() => {
                            store.dispatch(getBeers(i))
                            router.push(`/beer/${i.id}`)}
                        } >
                            <h3>{i.name}</h3>
                            <img  className={'beer-img'} src={i.image_url} height={'100px'} alt={'beer photo'}/>
                            <p className={'description'}>{descriptionCheck(i)}</p>
                        </div>


                    )
                })
            )
        } else {
            return (
                beers.map(i => {
                        return (

                            <div key={i.id} className={styles.beercard} onClick={() => {
                                store.dispatch(getBeers(i))
                                router.push(`/beer/${i.id}`)

                            }}
                            >
                                <h3>{i.name}</h3>
                                <img className={'beer-img'} src={i.image_url} height={'100px'} alt={'beer image'}/>
                                <p className={'description'}>{descriptionCheck(i)}</p>
                            </div>
                        )
                    }
                ))
        }
    }


    return (
        <div className={styles.container}>

            <main className={styles.main}>
                <h1> Beers list</h1>
                <input type={"text"} value={beerName} onChange={changeBeerName} placeholder={'Check me'}></input>
                <div ref={scrollContainerRef} className={styles.listbeers}>
                    {
                        render()
                    }
                </div>
            </main>

            <footer className={styles.footer}>

            </footer>
        </div>
    )
}

