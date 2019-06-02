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

import * as fs from "fs";
import {mkdirSync} from "fs";
import {FileEncrypt}from "node-file-encrypt";

export function mkdirIfNotExists(dir) {

    if(fs.existsSync(dir) === false) {

        mkdirSync(dir, 'recursive');

    }

}

export function createFileIfNotExists(filename, content) {

    if(fs.existsSync(filename) === false) {

        fs.writeFileSync(filename, content);

    }

}

export function updateFile(filename, content) {

}

export function lockFile(filename, secret) {

    let encryptPath = '';
    try {
        let f = new FileEncrypt(filename);
        f.openSourceFile();
        f.encrypt(secret);
        encryptPath = f.encryptFilePath;
    } catch(err) {
        throw err;
    }

    fs.unlinkSync(filename);

    return encryptPath;

}

export function unlockFile(filename, secret) {

    try{
        let f = new FileEncrypt(filename);
        f.openSourceFile();
        f.decrypt(secret);

    } catch(err) {
        throw err;
    }


}

export function writeBinary(filename, binData) {

}

export function readBinary(filename) {

}

export function writeToDistributedFS(client, filename, filedata) {

}

export function readFromDistributedFS(client, fileToRead) {

}