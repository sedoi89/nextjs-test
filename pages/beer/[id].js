import styles from '../../styles/Home.module.scss'
import Link from "next/link";
import Image from "next/image";



export const getServerSideProps = async (context) => {
    const id = context.params.id
    const res = await fetch(`https://api.punkapi.com/v2/beers/` + id)
    const data = await res.json()
    console.log(data)
    if (data.error) {
        return {
            redirect: {
                permanent: false,
                destination: '/404'
            }
        }
    }

    return {
        props: {
            data
        }
    }
}


export default function Beers({data}) {



    return (
        <div className={styles.bigContainer}>
            <div className={styles.beerBig}>
                <h1>{data[0].name}</h1>
                <p>{data[0].tagline}</p>
                <button><Link href={'/'}>Back to main</Link></button>
                <img src={data[0].image_url} alt={'beer image'}/>

                <div className={styles.title}>
                    <p >Description</p>
                    <p>{data[0].description}</p>
                </div>


                <div className={styles.tableContainer}>


                    <table>
                        <tbody>
                        <tr>
                            <td>ABV</td>
                        </tr>
                        <tr>
                            <td>{data[0].abv} %</td>
                        </tr>
                        </tbody>
                    </table>

                    <table>
                        <tbody>
                        <tr>
                            <td>
                                Food pairing
                            </td>
                        </tr>
                        {
                            data[0].food_pairing.map(i =>
                                <tr key={i}>
                                    <td>{i}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}


