import BigXO from "../../components/BigXO/bigXo.component"
import "./gamepage.styles.css"

const GamePage: React.FC = () => {
    return (
        <div className="game-container">
            <BigXO />
        </div>
    )
}

export default GamePage;