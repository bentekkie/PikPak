import { ILoginResponse, IUserResponse, IUser, INewUserParams } from "./model";
import { postData, fetchData } from "./utils";
import { async } from "q";

export async function login(username: string, password: string){
    let resp : ILoginResponse = await postData('/api/auth/login',{
        username,
        password
    })
    if(resp.authToken){
        sessionStorage.setItem('authToken',resp.authToken)
        console.log(resp.authToken)
        return getCurrentUser()
    }else{
        alert ("Invalid username/password")
        throw Error("invalid username/password")
    }
}

export async function logout(){
    sessionStorage.removeItem('authToken')
    return true
}

export async function register(username: string, password: string) : Promise<IUserResponse>{
    return postData('/api/auth/register',{
        username,
        password
    } as INewUserParams)
}

export async function updateUser(user : Partial<IUser>){
    return postData('/api/auth/update',user)
}

export async function getCurrentUser(){
    return fetchData('api/auth')
}
