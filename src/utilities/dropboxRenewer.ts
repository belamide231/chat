import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

import { dropbox, sqlite } from '../app';

const dropboxRenewer = async (): Promise<string> => {

    try {

        const response = await axios.post('https://api.dropbox.com/oauth2/token', null, {
            params: {
                refresh_token: process.env.DROPBOX_TOKEN,
                grant_type: 'refresh_token',
                client_id: process.env.DROPBOX_KEY,
                client_secret: process.env.DROPBOX_SECRET
            }
        });

        return response.data.access_token;

    } catch (error) {

        console.log(error)
        return '';
    }
}


export const observeDropbox = async () => {
}