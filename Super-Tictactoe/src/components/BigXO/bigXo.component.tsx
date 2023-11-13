import "../../tailwind.css";
import XO from "../XO/xo.component";
const BigXO = () => {
    return (
        <div className="grid grid-cols-3 grid-rows-3 gap-8 border-2 border-red-500">
            <XO />
            <XO />
            <XO />
            <XO />
            <XO />
            <XO />
            <XO />
            <XO />
            <XO />
        </div>
    )
}

export default BigXO;