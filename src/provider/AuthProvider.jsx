import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { app } from "../firebase/firebase.config";
// import useAxiosPublic from "../Hooks/useAxiosPublic";

export const AuthContext = createContext();


const AuthProvider = ({ children }) => {

    // const axiosPublic = useAxiosPublic();


    const auth = getAuth(app);

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState('')

    console.log(user);


    const signUp = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const logout = () => {
        setLoading(true);
        signOut(auth);
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    const updateUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            console.log('current user', currentUser);
            // if (currentUser) {
            //     const userInfo = { email: currentUser.email };
            //     axiosPublic.post('/jwt', userInfo)
            //         .then(res => {
            //             if (res.data.token) {
            //                 localStorage.setItem('access-token', res.data.token);
            //             }
            //         })

            // }
            // else {
            //     localStorage.removeItem('access-token');
            // }
            setLoading(false);
        });
        return () => {
            return unsubscribe();
        }
    }, []);

    const [theme, setTheme] = React.useState('light');
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    // initially set the theme and "listen" for changes to apply them to the HTML tag
    React.useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', theme);
    }, [theme]);



    const authValues = {
        user,
        setUser,
        signUp,
        logout,
        signIn,
        loading,
        updateUser,
        email,
        setEmail,
        theme,
        toggleTheme
    }

    return (
        <AuthContext.Provider value={authValues}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider; 