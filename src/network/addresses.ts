/*
 * Copyright (c) 2019. The Swaggit Network (www.swaggit.net)
 * Copyright (c) 2019. Nicolas Cloutier (nicknailers69@gmail.com)
 *
 *  This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use strict';

import crypto, {ECDH} from 'crypto';
import bs58 from 'bs58';

//1 byte network identifier
export const DEV_NETWORK = 0x73;
export const TEST_NETWORK = 0x74;
export const LIVE_NETWORK = 0x76;

//1 byte version
export const PUBLIC_VERSION = 0x70;
export const DEV_VERSION = 0x71;
export const TEST_VERSION = 0x72;

export const ADDRESS_TYPE_BLOCK = 0x7069;
export const ADDRESS_TYPE_WALLET = 0x7079;
export const ADDRESS_TYPE_TRANSACTION = 0x7089;
export const ADDRESS_TYPE_COINBASE = 0x9999;

//Example: PUBLIC WALLET ADDRESSES STARTS WITH THE PREFIX DHS9


export function createWalletAddress(network = LIVE_NETWORK) {


    return generateAddress(network, PUBLIC_VERSION, ADDRESS_TYPE_WALLET);

}

export function createCoinbaseAddress(network = LIVE_NETWORK) {



}


/**
 *
 * @param address
 * @param network
 * @param version
 *
 * @description validateWalletAddress
 *
 * @var decoded = base58 decoded of the address
 * @var NByte = byte representing the network the address is on
 * @var TByte = byte representing the type of address (in this case should match wallet)
 * @var VByte = byte representing the version of the address and network (this should match current network settings as well)
 *
 * @returns boolean
 *
 * @description
 * if we can extract a public key from the address = true, if not validation fails with false
 * all variable must match the current network, address type and version if not, validation will fail with false
 *
 */

export function validateWalletAddress(address: string, network = LIVE_NETWORK, version = PUBLIC_VERSION) {

    const decoded = bs58.decode(address);

    const NByte = decoded[36];
    const arr = [];
    arr.push(decoded[0]);
    arr.push(decoded[1]);

    const TByte = Buffer.from(arr);

    const VByte = decoded[2];

    if(getPublicKeyFromAddress(address) === false) {
        return false;
    }

    return parseInt(TByte.toString('hex'), 16) === (ADDRESS_TYPE_WALLET) && NByte === network && VByte === version;
}

export function getPublicKeyFromAddress(address) {
    const ecdh = crypto.createECDH('secp256k1');
    const decoded = bs58.decode(address);
    const encPub = decoded.slice(3, 36).toString('hex');

    return ECDH.convertKey(encPub, 'secp256k1', 'hex', 'hex', 'uncompressed') || false;


}

/**
 *
 * @param network
 * @param version
 * @param type
 *
 * @Address length = 39 bytes
 * @description addressBuffer
 *
 * Buffer (39 bytes total) [ 2 byte (type) | 1 byte padding | 1 byte (version) | 33 bytes (public key compressed and base58) | 1 byte (network) | verification byte (1 byte) ]
 *
 * @description bytes
 * Byte description:
 * @description pubKey bytes = Int16 Little Endian
 * @description type bytes = Int16 Big Endian
 * @description version bytes = Int8
 * @description network bytes = Int8
 * @description vbye = Int16 Big Endian
 *
 *
 */

export function generateAddress(network, version, type) {

    const ecdh = crypto.createECDH('secp256k1');
    ecdh.generateKeys();
    let pub = ecdh.getPublicKey('hex', 'compressed');
    let priv = ecdh.getPrivateKey('hex');

    //last 2 bytes of hash are the verifier bytes

    const buf = Buffer.from(pub, 'hex');

    const buffer = Buffer.allocUnsafe(buf.length + 4);

    let i = 0;
    for (const value of buf.values()) {
        buffer.writeInt16LE(value, i);
        i++;
    }


    const buf2 = Buffer.allocUnsafe(buf.length + 6);

    const addressBuffer = buf2;
    addressBuffer.writeInt16BE(type, 0);
    addressBuffer.writeInt8(version, 2);

    let n = 3;
    for (const value of buf.values()) {
        addressBuffer.writeInt16LE(value, n);
        n++;
    }

    addressBuffer.writeInt8(network, 36);

    const hash = crypto.createHash('sha3-512').update(addressBuffer).digest();
    addressBuffer.writeInt16BE(hash[hash.length - 2], 37);

    let jsonAddress = {
        pubKey:pub,
        privKey:priv,
        address: bs58.encode(addressBuffer),
    };

    return jsonAddress;
}