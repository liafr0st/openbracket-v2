import { Node, Relationship, Integer, DateTime } from "neo4j-driver";
import cfg from "../config.json";
import * as db from "./utils/db"
import * as security from "./utils/security"
import * as obmath from "./utils/obmath"
import { Request } from 'express';
import { OpenBracketError } from "./utils/OpenBracketError";
import { StringLiteral } from "typescript";
import { BracketStructure } from "./utils/types";

interface TournamentCreateRes {
    name: string;
    id: number;
}

interface TournamentCreateQuery {
    name: string;
    passwordHash: string;
    salt: string;
    participants: string[];
};

export async function create(req: Request): Promise<TournamentCreateRes> {

    // console.log("Start")

    const name: string = req.body.name;
    const pwd: string = req.body.password;
    const participants: string = req.body.participants;
    let isSeeded: boolean = req.body.isSeeded;

    if (!isSeeded) { isSeeded = false };

    let participantsList: string[] = participants.split('\n');
    const participantsCount: number = participantsList.length

    let errstring: string = "";

    if (!name) { errstring += "No username specified\n" };
    if (!pwd) { errstring += "No password specified\n" };
    if (participantsCount < 2) { errstring += "Insufficient participants specified\n"};
    if (errstring.length > 0) { throw new OpenBracketError(errstring) };

    security.checkPassword(pwd);

    // console.log("Valid Input")

    const salt = security.generateSalt();

    const pwdHash: string = security.hashPassword(pwd+salt);

    if (!isSeeded) {participantsList = obmath.shuffleParticipants(participantsList)}

    let query: string = `CREATE (t:Tournament {name: $name, passwordHash: $passwordHash, salt: $salt})\n`;

    for (let i = 0; i<participantsCount; i++) {
        query = query + `CREATE (p${i}:Participant {name: $participants[${i}]})\n`
    }

    // console.log("Participants Genned")

    const brktStruct : BracketStructure = obmath.bracketStructure(participantsCount);

    // console.log(brktStruct)

    query = query + `\
CREATE (r0m0:Match)
MERGE (r0m0)<-[:HAS_MATCH {type: "root"}]-(t)\n`

    if (brktStruct.rounds >= 3) {
        for (let i = 1; i<brktStruct.rounds-1; i++) {

            for (let j = 0; j<Math.pow(2,i); j++) {

                // console.log(`Intermediate Rounds: r${i}m${j}`)
                let isUpper : string = (j%2==0) ? "upper" : "lower";
                let prevMatchTxt : string = `r${i-1}m${Math.floor(j/2)}`
                let currMatchTxt : string = `r${i}m${j}`

                query = query + `\
CREATE (${currMatchTxt}:Match)
MERGE (${currMatchTxt})<-[:HAS_MATCH {type: "${isUpper}"}]-(${prevMatchTxt})\n`

            }

        }
    }

    if (brktStruct.rounds >= 2) {
        for (let i = 0; i<Math.pow(brktStruct.rounds-1,2); i++) {

            // console.log(`First Round: r${brktStruct.rounds-1}m${i}`)
            let isUpper : string = (i%2==0) ? "upper" : "lower";
            let prevMatchTxt : string = `r${brktStruct.rounds-2}m${Math.floor(i/2)}`
            let currMatchTxt : string = `r${brktStruct.rounds-1}m${i}`

            if (brktStruct.positions[2*i]==-1 || brktStruct.positions[2*i+1]==-1) {
                query = query + `MERGE (${prevMatchTxt})-[:HAS_PARTICIPANT {type: "upper"}]->(p${brktStruct.positions[2*i]})\n`
                continue
            };
    
            query = query + `\
CREATE (${currMatchTxt}:Match)
MERGE (${currMatchTxt})<-[:HAS_MATCH {type: "${isUpper}"}]-(${prevMatchTxt})
MERGE (${currMatchTxt})-[:HAS_PARTICIPANT {type: "upper"}]->(p${brktStruct.positions[2*i]})
MERGE (${currMatchTxt})-[:HAS_PARTICIPANT {type: "lower"}]->(p${brktStruct.positions[2*i+1]})\n`

        }
    }
    query = query + "RETURN ID(t)";

    // console.log("Matches Genned")

    // console.log(query)

    // console.log("Query Printed")

    const queryParams : TournamentCreateQuery = {
        name: name,
        passwordHash: pwdHash,
        salt: salt,
        participants: participantsList
    }

    const { keys, records, summary } = await db.driver.executeQuery(
        query, queryParams, { database: cfg.neo4jdbname }
    )

    const map = records.map<Integer>(function (record) : Integer {
        return record.get("ID(t)")
    });

    // console.log(keys);
    // console.log(records);
    // console.log(summary);
    // console.log(map);

    const res : TournamentCreateRes = {
        name: name,
        id: map[0].toInt()
    }

    return res;

}