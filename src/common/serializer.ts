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

export const {Deserialize, Serialize} = require('beson');

const forge = require('node-forge');

export const createUTF8EmptyBuffer = () => {

    return forge.util.createBuffer('utf8');

};

export const createRAWEmptyBuffer = () => {

    return forge.util.createBuffer('raw');

};

export const createEmptyBytesBuffer = () => {
    return forge.util.createBuffer();
};

export const writeBytesToBuffer = (buf, bytesToInsert) => {

    return buf.putBytes(bytesToInsert);

};

export const writeInt32ToBuffer = (buf, int32ToInsert) => {

    return buf.putInt32(int32ToInsert);

};

export const convertBufferToHex = (buf) => {
    return buf.toHex();
};

export const getBufferBytes = (buf) => {

    return buf.bytes();

};

export const getBufferBytesAndEmpty = (buf) => {

    return buf.getBytes();

};

export const toNodeBuffer = (buf) => {

    return Buffer.from(getBufferBytes(buf), 'binary');

};

export const toForgeBuffer = (buf) => {

    return forge.util.createBuffer(buf.toString('binary'));

};

export const parseURL = (url) => {

    return forge.util.parseUrl(url);

};

