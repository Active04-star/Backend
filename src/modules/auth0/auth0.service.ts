import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { Auth0TokenRequestDto } from 'src/dtos/auth-token-response';
import { User } from 'src/entities/user.entity';
import { ApiStatusEnum } from 'src/enums/HttpStatus.enum';
import { ApiError } from 'src/helpers/api-error-class';

@Injectable()
export class Auth0Service {
    
    constructor() { }


    async updateUserPassword(user: User, password: string) {
        console.log(password);
        try {
            const token_request: Auth0TokenRequestDto = await this.getAuthToken();

            const data = JSON.stringify({
                "password": password,
                "connection": "Username-Password-Authentication"
            });

            const user_update_options = {
                method: 'PATCH',
                maxBodyLength: Infinity,
                url: `${process.env.AUTH0_ISSUER_BASE_URL}users/${user.authtoken}`,
                headers: {
                    'Authorization': `Bearer ${token_request.access_token}`,
                    'Content-type': 'application/json'
                },
                data: data
            };

            await axios.request(user_update_options).then((response) => {
                console.log(response);

            }).catch((error) => {
                console.log(error);
                throw new ApiError(ApiStatusEnum.UNKNOWN_ERROR, InternalServerErrorException, error);
            });

        } catch (error) {
            throw error;
        }
    }


    async getUserByMail(email: string): Promise<any> {

        const token_request: Auth0TokenRequestDto = await this.getAuthToken();
        let to_return: any;

        const user_request_options = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `${process.env.AUTH0_ISSUER_BASE_URL}users-by-email?include_fields=true&email=${email}`,
            headers: {
                'Authorization': `Bearer ${token_request.access_token}`,
                'Content-type': 'application/json'
            }
        };

        await axios.request(user_request_options).then((response) => {
            to_return = response.data;

        }).catch((error) => {
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
            } else {
                console.error('Error message:', error.message);
            }

            throw new ApiError(ApiStatusEnum.UNKNOWN_ERROR, InternalServerErrorException, error);
        });

        return to_return;
    }


    async syncUser(localUser: { name: string, email: string; password: string; id: string }) {

        try {
            const token_request: Auth0TokenRequestDto = await this.getAuthToken();
            const users = await this.getUserByMail(localUser.email);

            if (users.length === 0) {

                const data = JSON.stringify({
                    "email": localUser.email,
                    "user_metadata": {
                        localUserId: localUser.id
                    },
                    "name": localUser.name,
                    "connection": "Username-Password-Authentication",
                    "password": localUser.password,
                });

                const user_create_options = {
                    method: 'POST',
                    maxBodyLength: Infinity,
                    url: `${process.env.AUTH0_ISSUER_BASE_URL}users`,
                    headers: {
                        'Authorization': `Bearer ${token_request.access_token}`,
                        'Content-type': 'application/json'
                    },
                    data: data
                };

                await axios.request(user_create_options).then((response) => {
                    console.log(response.data);

                }).catch((error) => {
                    console.log(error);
                    throw new ApiError(ApiStatusEnum.UNKNOWN_ERROR, InternalServerErrorException, error);
                });

            } else {
                console.log('El usuario ya existe en Auth0');

            }

        } catch (error) {
            console.error('Error al sincronizar usuario con Auth0:', error);
            throw error;

        }
    }


    async getAuthToken(): Promise<Auth0TokenRequestDto> {
        let token_request: Auth0TokenRequestDto;

        const token_request_options = {
            method: 'POST',
            url: process.env.AUTH0_TOKEN_ENDPOINT,
            headers: { 'content-type': 'application/json' },
            data: {
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                audience: process.env.AUTH0_ISSUER_BASE_URL,
                grant_type: "client_credentials"
            }
        };

        await axios.request(token_request_options).then((response) => {
            token_request = response.data;

        }).catch((error) => {
            throw new ApiError(ApiStatusEnum.UNKNOWN_ERROR, InternalServerErrorException, error);

        });

        return token_request;
    }

}
