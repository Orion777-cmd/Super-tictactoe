import { createContext, useContext, useState, ReactNode } from "react";

type GridState = "X" | "O" | null;

interface TicTacToeContextProps {
    sign: "X" | "O";
    toggleSign: () => void;
    updateWinnerBoardState: (index: number,innerIndex: number,  state: GridState | "draw") => void;
    winner: (GridState | "draw")[];
    setWinner: React.Dispatch<React.SetStateAction<(GridState | "draw")[]>>;
    bigBoard: (GridState | "draw")[][]; 
    setBigBoard: React.Dispatch<React.SetStateAction<(GridState | "draw")[][]>>; 
    updateBigBoardState: (index: number, innerIndex: number, state: GridState | "draw") => void;
    wholeGameWinner: GridState | "draw";
    setWholeGameWinner: React.Dispatch<React.SetStateAction<GridState | "draw" | null>>;
    updateWholeGameWinner: (state: GridState | "draw") => void;
   
    activeIndex : number ;
    updateActiveIndexState : (index: number) => void;
    isGameStarted: boolean;
    updateIsGameStarted: () => void;
}

const TicTacToeContext = createContext<TicTacToeContextProps>({
    sign: "X",
    toggleSign: () => {},
    updateWinnerBoardState: () => {},
    winner: [],
    setWinner: () => {},
    bigBoard: [[]], 
    setBigBoard: () => {},
    updateBigBoardState: () => {},
    wholeGameWinner: null,
    setWholeGameWinner: () => {},
    updateWholeGameWinner: () => {},    
    activeIndex: -1,
    updateActiveIndexState: () => {},
    isGameStarted: false,
    updateIsGameStarted: () => {},
  
});

export const TicTacToeProvider = ({ children }: { children: ReactNode }) => {
    const [sign, setSign] = useState<"X" | "O">("O");
    const [winner, setWinner] = useState<Array<GridState|"draw">>(Array(9).fill(null));
    const [bigBoard, setBigBoard] = useState<Array<Array<GridState | "draw">>>(() => {
        const initialBoard: Array<Array<GridState | "draw">> = [];
        for (let i = 0; i < 9; i++) {
            initialBoard.push(Array(9).fill(null));
        }
        return initialBoard;
    });
    
    
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

    const toggleSign = () => {
        setSign((prevSign) => (prevSign === "X" ? "O" : "X"));
    };

    const updateWinnerBoardState = (index: number,innerIndex: number, state: GridState | "draw") => {

        if (winner[innerIndex] === null && innerIndex !== index) {
            updateActiveIndexState(innerIndex);
        }else{
            updateActiveIndexState(-1);
        }

        const newBoard = [...winner];
        if (state) {
            newBoard[index] = state;
        }
        setWinner(newBoard);       
                
    };

    const updateBigBoardState = (index: number, innerIndex: number, state: GridState | "draw") => {
        console.log("one one one");
        if (winner[innerIndex] === null) {
            updateActiveIndexState(innerIndex);
        }else{
            updateActiveIndexState(-1);
        }
        
        const newBigBoard = [...bigBoard];
        if (state) {
            newBigBoard[index][innerIndex] = state;
        }
       
        setBigBoard(newBigBoard);        
    };

    const [wholeGameWinner, setWholeGameWinner] = useState<GridState | "draw" | null>(null);
    const updateWholeGameWinner = (state: GridState | "draw") => {
        setWholeGameWinner(state);
    };

    const updateActiveIndexState = (index : number) => {
        setActiveIndex(index);
    }

    const updateIsGameStarted = () => {
        setIsGameStarted(!isGameStarted);
    }

    return (
        <TicTacToeContext.Provider value={{ sign,
                                            toggleSign,
                                            updateWinnerBoardState,
                                            winner, bigBoard, 
                                            updateBigBoardState, 
                                            setWinner, 
                                            setBigBoard, 
                                            wholeGameWinner,
                                            setWholeGameWinner,
                                            updateWholeGameWinner,
                                            activeIndex, 
                                            updateActiveIndexState,
                                            isGameStarted,
                                            updateIsGameStarted,
                                            }}>
            {children}
        </TicTacToeContext.Provider>
    );
};

export const useTicTacToe = () => {
    return useContext(TicTacToeContext);
};
