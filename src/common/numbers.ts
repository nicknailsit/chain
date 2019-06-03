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

//tool to get non-standard js numbers

import {BigFloat32} from "bigfloat";
import {arguments} from "assert";
import {UInt256, U256} from "uint256/dist/UInt256";

const forge = require('node-forge');

export const {Int128, UInt128, Int32, Uint32, Int64, Uint64} = require('beson');

export const AddU256 = (...args: [UInt256]) => {

    let x = args[0];

    for (let i = 1; i < args.length; i++) {

        x.add(args[i]);

    }

    return x;

};

export const SubU256 = (...args: [UInt256]) => {

    let x = args[0];

    for (let i = 1; i < args.length; i++) {

        x.sub(args[i]);

    }

    return x;

};

export const MulU256 = (...args: [UInt256]) => {

    let x = args[0];

    for (let i = 1; i < args.length; i++) {

        x.mul(args[i]);

    }

    return x;

};

export const DivU256 = (...args: [UInt256]) => {

    let x = args[0];

    for (let i = 1; i < args.length; i++) {

        x.div(args[i]);

    }

    return x;

};

export const fAdd = (...args: [BigFloat32]) => {


    let bigfloat = new BigFloat32();
    bigfloat.setZero();

    let x = args[0];

    for (let i = 1; i < args.length; i++) {

        x.add(args[i]);
        i++;

    }

    return bigfloat.setValue(x).toString();

};

export const fSub = (...args: [BigFloat32]) => {

    let bigfloat = new BigFloat32();
    bigfloat.setZero();

    let x = args[0];

    for (let i = 1; i < args.length; i++) {

        x.sub(args[i]);
        i++;

    }

    return bigfloat.setValue(x).toString();


};

export const fMul = (...args: [BigFloat32]) => {

    let bigfloat = new BigFloat32();
    bigfloat.setZero();

    let x = args[0];


    for (let i = 1; i < args.length; i++) {

        x.mul(args[i]);
        i++;

    }

    return bigfloat.setValue(x).toString();
};

export const generateRandomPrime = async (bits: number) => {

    return await forge.prime.generateProbablePrime(bits, function (err, num) {
        return num.toString();
    });

};

export const generateSecureRandomBytes = (bytes: number, toHex = false) => {
    let B = forge.random.getBytesSync(bytes);
    if (toHex === true) {
        return forge.util.bytesToHex(B);
    } else if (toHex === false) {
        return B;
    }

    return null;

};