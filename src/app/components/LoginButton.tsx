'use client';
import { ConnectButton } from "thirdweb/react"
import { client } from "../client"
import { generatePayload, isLoggedIn, login, logout } from "../actions/auth";
import { base } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";

export const LoginButton = () => {
    return (
        <ConnectButton
        client={client}
        // accountAbstraction={{
        //     chain: base,
        //     sponsorGas:true
        // }}
        auth={{
        isLoggedIn: async () => {
            try {
            const result = await isLoggedIn();
            console.log("✅ isLoggedIn:", result);
            return result;
            } catch (err) {
            console.error("❌ isLoggedIn error:", err);
            return false;
            }
        },
        doLogin: async (params) => {
            try {
            console.log("🔐 Logging in with params:", params);
            await login(params);
            } catch (err) {
            console.error("❌ doLogin error:", err);
            }
        },
        getLoginPayload: async ({ address }) => {
            try {
            console.log("📦 Generating payload for:", address);
            return generatePayload({
                address,
                chainId: base.id,
            });
            } catch (err) {
            console.error("❌ getLoginPayload error:", err);
            throw err;
            }
        },
        doLogout: async () => {
            try {
            console.log("👋 Logging out");
            await logout();
            } catch (err) {
            console.error("❌ doLogout error:", err);
            }
        }
        }}
        />
    )
};