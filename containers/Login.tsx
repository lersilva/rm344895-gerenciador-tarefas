import type { NextPage } from "next";
import { useState } from "react";
import { executeRequest } from "../services/api";

type LoginProps = {
    setToken(s: string): void
}

export const Login: NextPage<LoginProps> = ({setToken}) => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [newPassword, setNewPassword] = useState('');


    const doRegister = async () => {
        try{
            setError('');
            if(!email || !newPassword || !name){
                setError('Favor preencher os campos!');
                return
            }

            const body = {
                name,
                email,
                newPassword
            };

            console.log(body);
            const result = await executeRequest('user', 'post', body);
            if(result && result.data){
                const obj = result.data;
                console.log(obj);
            }
        }catch(e : any){
            console.log(`Erro ao efetuar o cadastro: ${e}`);
            if(e?.response?.data?.error){
                setError(e.response.data.error);
            }else{
                setError(`Erro ao efetuar o cadastro, tente novamente.`);
            }
        }
    }
    
    const doLogin = async () => {
        try{
            setError('');
            if(!login || !password){
                setError('Favor preencher os campos!');
                return
            }

            setLoading(true);

            const body = {
                login,
                password
            };

            const result = await executeRequest('login', 'post', body);
            if(result && result.data){
                const obj = result.data;
                localStorage.setItem('accessToken',obj.token);
                localStorage.setItem('name',obj.name);
                localStorage.setItem('email',obj.email);
                setToken(obj.token);
            }
        }catch(e : any){
            console.log(`Erro ao efetuar login: ${e}`);
            if(e?.response?.data?.error){
                setError(e.response.data.error);
            }else{
                setError(`Erro ao efetuar login, tente novamente.`);
            }
        }

        setLoading(false);
    }

    return (
        <div className="container-login">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <div className="form">
                {error && password != undefined && <p className="error">{error}</p>}
                <div className="input">
                    <img src="/mail.svg" alt="Login Icone" />
                    <input type='text' placeholder="Login"
                        value={login}
                        onChange={evento => setLogin(evento.target.value)}
                    />
                </div>
                <div className="input">
                    <img src="/lock.svg" alt="Senha Icone" />
                    <input type='password' placeholder="Senha"
                        value={password}
                        onChange={evento => setPassword(evento.target.value)}
                    />
                </div>
                <button onClick={doLogin} disabled={loading}>{loading ? '...Carregando': 'Login'}</button>
            </div>

            <div className="form">
                Não tem conta? Cadastre-se abaixo
                {error && <p className="error">{error}</p>}
                <div className="input">
                    <input type='text' placeholder="Nome"
                        value={name}
                        onChange={evento => setName(evento.target.value)}
                    />
                </div>
                <div className="input">
                  
                    <input type='text' placeholder="e-mail"
                        value={email}
                        onChange={evento => setEmail(evento.target.value)}
                    />
                </div>
                <div className="input">
                    
                    <input type='password' placeholder="Senha"
                        value={newPassword}
                        onChange={evento => setNewPassword(evento.target.value)}
                    />
                </div>
                <button onClick={doRegister}>Cadastrar</button>
            </div>
        </div>

        
    );
}