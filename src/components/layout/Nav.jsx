import { Link } from "react-router"
import styles from './Nav.module.css'

function Nav() {
    return(
        <>
        <nav className={styles.container}>
            <ul>
                <li><Link className={styles.link} to='/'>Inicio</Link></li>
                <li><Link className={styles.link}to='/criar'>Criar conta</Link></li>
            </ul>
        </nav>
        </>
    )
}

export default Nav