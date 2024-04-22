import {createContext, useContext, useState, useEffect} from "react";
import {auth , database} from "../firebase/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    
} from "firebase/auth";

import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";

type UserDB = {
    userId: string;
    email: string;
    username: string;
}

type AuthContextType = {
    user: UserDB | null | undefined;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, username: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
    return useContext(AuthContext);
}

export const useUser = () => {
    const {user} = useContext(AuthContext);
    return user;
}

export const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const [user, setUser] = useState<UserDB | null | undefined>(undefined);

    const syncUser = async (userId: string) => {
        setUser(undefined);
        const qu = query(collection(database, "users"), where ("userId", "==", userId));
        const user = await getDocs(qu);
        if (user.docs.length > 0){
            setUser(user.docs[0].data() as UserDB);
        } else {
            setUser(null);
        }
    };

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);

    }

    const signup = async (email: string, password: string, username: string) => {
        const {user} = await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(database, "users"), {
            userId: user.uid,
            email: user.email,
            username,
        });
    };

    const logout = async () => {
        await auth.signOut();
    }

    const value = {
        user, 
        login, 
        signup,
        logout,
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user){
                syncUser(user.uid);
            }else {
                setUser(null);
            }
        });

        return unsubscribe;
    },[]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;