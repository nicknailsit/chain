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

import {gql} from 'apollo-server';

const typeDefs = gql`
    
    type Query {
     
        me: Wallet!
        transactions(address: String!, key:String!): [Transaction]!
        transaction(address: String!, key:String!): Transaction!
        balance(address:String!, key:String!): String
        txStatus(txID:ID!): TransactionResponse!
        coinStats:[String]
        
    }
    
    type Transaction {
        inputs: [Input!]!
        outputs: [Output!]!
        status: String!
        data: [String]!
    }
    
    type Input {
        txID: ID!
        amount: String
        address: String
        data: [String]!
    }
    
    type Output {
        amount: String!
        data: [String]!
    }
    
    type Wallet {
        
        address: String!
        isLocked: Boolean
        transactions: [Transaction]!
        received: String
        spent: String
        fees: String
        balance: String
        
    }
    
    type ContentWallet {
        address: String!
        isLocked: Boolean!
        data: [String!]!
        rewards: String!
        lastUpdate: String!
    }
    
    type TransactionResponse {
        success: Boolean!
        message: String
        txID: String!
        status: String!
        data: [String]
    }
    
    type Mutation {
        login(address: String!, chainID: String!, key: String!): String
        register(email: String, walletType: String, chainID: String): Wallet!
        unlock(address: String, secret: String): Wallet!
        lock(address: String): Boolean!
        sendSwaggs(address: String!, to:String!, amount: String!, txKey: String!, anonymous: Boolean): TransactionResponse!
        confirmSwaggs(txID: ID!, confirm:Boolean!): TransactionResponse!
        createContent(address: String!, data: [String!]!): TransactionResponse!
        createApplication(address: String!, appName: String!, loginKey: String!): TransactionResponse!
        createNewToken(address: String!, tokenData: [String!]!, appKey: String!): TransactionResponse!
    }
    
`;


export default typeDefs;