import React, {useState, useContext, createContext, useEffect} from 'react';
import { IUserData } from '@/interfaces/UserData';
//const AuthContext = createContext({});

export const AuthContext = createContext<IUserData | null | any>(null);

const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [userData, setUserData] = useState<IUserData | null>(null);

    const updateUser = (userToUpdate:IUserData) => {
        setUserData(userToUpdate);
    }

    return(
        <AuthContext.Provider value={{userData, updateUser}}>
            {children}
        </AuthContext.Provider>
    )
}

// const AuthProvider = ({children}:any) => {
//     const userData = useContext(AppContext);


//     // useEffect(() => {
//     //     if(usuario.paiId) enviarOk();
//     // }, [usuario]);

//     // const atualizarUsuario = ({paiId, alunoId}) => {
//     //     let usuarioAtualizar = {...usuario};

//     //     if(alunoId) usuarioAtualizar.alunoSelecionadoId = alunoId;
//     //     if(paiId) usuarioAtualizar = {paiId, alunoSelecionadoId: 0};

//     //     setUsuario(usuarioAtualizar);
//     // }

//     return(
//         <AuthContext.Provider userData={userData}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

export { AuthProvider };

//export default AuthContext;