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

// block statuses inspired by Dogecoin

const BLOCK_VALID_UNKNOWN = 0;
const BLOCK_VALID_HEADER = 1; //timestamp not in future, good POW, num tx === ok
const BLOCK_VALID_TREE = 2; // all parent headers found, diff match, timestamp >= previous, all parent === TREE
const BLOCK_VALID_TRANSACTIONS = 3; // 1st = coinbase, 2 <= coinbase input script length >= 100, tx valid, no dupe txids, size, merle roots
const BLOCK_VALID_CHAIN = 4; // output <= input, no double spends, coinbase output is ok, no immature coinbase spent, parents = CHAIN
const BLOCK_VALID_SCRIPTS = 5; // scripts & signatures = ok
const BLOCK_VALID_MASK = [BLOCK_VALID_HEADER,BLOCK_VALID_TREE,BLOCK_VALID_TRANSACTIONS,BLOCK_VALID_CHAIN,BLOCK_VALID_SCRIPTS];
const BLOCK_HAVE_FULL_DATA = 8;
const BLOCK_HAVE_SNAPSHOT = 16;
const BLOCK_HAVE_MASK = [BLOCK_HAVE_FULL_DATA,BLOCK_HAVE_SNAPSHOT];

const BLOCK_FAILED_VALID = 32;
const BLOCK_FAILED_CHILD = 64;
const BLOCK_FAILED_MASK = [BLOCK_FAILED_VALID,BLOCK_FAILED_CHILD];

const TX_VALID_UNKNOWN = 100;
const TX_VALID_OUTPUTS = 111;
const TX_VALID_INPUTS = 122;
const TX_VALID_NONCE_HASH = 133;
const TX_VALID_ADDRESS = 144;
const TX_VALID_AMOUNT = 155;
const TX_VALID_NO_DOUBLE_SPEND = 188;

const TX_VALID_MASK = [TX_VALID_OUTPUTS, TX_VALID_INPUTS, TX_VALID_NONCE_HASH, TX_VALID_ADDRESS, TX_VALID_AMOUNT, TX_VALID_NO_DOUBLE_SPEND];
