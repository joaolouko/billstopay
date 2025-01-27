import { Link } from "react-router"

function Nav() {
    return(
        <>
        <nav>
            <ul>
                <li><Link to='/'>Inicio</Link></li>
                <li><Link to='/criar'>Criar conta</Link></li>
            </ul>
        </nav>
        </>
    )
}

export default Nav