import { defineChain, getContract } from "thirdweb";
import { client } from "../client";
import { balanceOf } from "thirdweb/extensions/erc1155";
import { base } from "thirdweb/chains";

export async function hasAccess(
    address: string,
): Promise<boolean> {
    const quantityRequired = 1n;

    const contract = getContract({
        client: client,
        chain: defineChain(base),
        address: "0xd559CcCEF096d5877ECA353aa2141F84E6487B5C" // change in claim-nft also
    });

    const ownedBalance = await balanceOf({
        contract: contract,
        owner: address,
        tokenId: 1n
    });
    
    return ownedBalance >= quantityRequired;
}