import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import userpool from '../components/userpool';
import { useNavigate } from 'react-router-dom';

export default function authenticate(username,password) {
    return new Promise((resolve,reject)=>{
        const user=new CognitoUser({
            Username:username,
            Pool:userpool
        });

        const authDetails= new AuthenticationDetails({
            Username:username,
            Password: password
        });

        user.authenticateUser(authDetails,{
            onSuccess:(result)=>{
                resolve(result);
            },
            onFailure:(err)=>{
                reject(err);
            }
        });
    });
};