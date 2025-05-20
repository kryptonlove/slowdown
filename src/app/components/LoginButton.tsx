'use client';
import { ConnectButton } from "thirdweb/react"
import { client } from "../client"
import { generatePayload, isLoggedIn, login, logout } from "../actions/auth";

export const LoginButton = () => {
    return (
        <ConnectButton
        client={client}
        auth={{
            isLoggedIn: async(address) => {
                return await isLoggedIn();
            },
            doLogin: async (params) => {
                await login(params);
            },
            // getLoginPayload: async ({ address }) => {
            //     if (typeof window !== 'undefined' && address) {
            //       window.playerAddress = address;
            //       console.log("Player address set:", window.playerAddress);
            //     }
            //     return await generatePayload({ address });
            //   },              
            getLoginPayload: async ({ address }) => generatePayload({address}),

            doLogout: async () => {
                await logout();
            }
        }}
        />
    )
};