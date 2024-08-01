import cfg from "../config.json";
import * as db from "./utils/db";
import * as security from "./utils/security";
import * as obmath from "./utils/obmath";
import { Request } from 'express';
import { OpenBracketError } from "./utils/OpenBracketError";
import { BracketStructure, HashTable, HasMatchProperties, HasResultProperties, MatchProperties, OBMatch, OBParticipantScorePair, OBTournament, ParticipantProperties, TournamentProperties } from "./utils/types";
import { nullmatch } from "./utils/nullobjects";

interface TournamentCreateQuery {
    name: string;
    passwordHash: string;
    salt: string;
    participants: string[];
};

export async function create(req: Request): Promise<void> {

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
    if (participantsCount > 255) { errstring += "Too many participants specified (max. 255)\n"};
    if (errstring.length > 0) { throw new OpenBracketError(errstring) };

    security.checkPassword(pwd);

    // console.log("Valid Input")

    const salt = security.generateSalt();

    const pwdHash: string = security.hashPassword(pwd+salt);

    if (!isSeeded) {participantsList = obmath.shuffleParticipants(participantsList)}

    let query: string = `CREATE (t:Tournament {name: $name, passwordHash: $passwordHash, salt: $salt, uuid: randomUUID()})\n`;

    for (let i = 0; i<participantsCount; i++) {
        query = query + `CREATE (p${i}:Participant {name: $participants[${i}], uuid: randomUUID()})\n`
    }

    // console.log("Participants Genned")

    const brktStruct : BracketStructure = obmath.bracketStructure(participantsCount);

    // console.log(brktStruct)

    query = query + `\
CREATE (r0m0:Match {uuid: randomUUID()})
MERGE (r0m0)<-[:HAS_MATCH {type: "root"}]-(t)\n`

    if (brktStruct.rounds >= 3) {
        for (let i = 1; i<brktStruct.rounds-1; i++) {

            for (let j = 0; j<Math.pow(2,i); j++) {

                // console.log(`Intermediate Rounds: r${i}m${j}`)
                let isUpper : string = (j%2==0) ? "upper" : "lower";
                let prevMatchTxt : string = `r${i-1}m${Math.floor(j/2)}`
                let currMatchTxt : string = `r${i}m${j}`

                query = query + `\
CREATE (${currMatchTxt}:Match {uuid: randomUUID()})
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
                query = query + `MERGE (${prevMatchTxt})-[:HAS_RESULT {type: "upper"}]->(p${brktStruct.positions[2*i]})\n`
                continue
            };
    
            query = query + `\
CREATE (${currMatchTxt}:Match {uuid: randomUUID()})
MERGE (${currMatchTxt})<-[:HAS_MATCH {type: "${isUpper}"}]-(${prevMatchTxt})
MERGE (${currMatchTxt})-[:HAS_RESULT {type: "upper"}]->(p${brktStruct.positions[2*i]})
MERGE (${currMatchTxt})-[:HAS_RESULT {type: "lower"}]->(p${brktStruct.positions[2*i+1]})\n`

        }
    }
    query = query + "RETURN t";

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

    const map = records.map<TournamentProperties>(function (record) : TournamentProperties {
        return record.get("t").properties
    });

    // console.log(keys);
    // console.log(records);
    // console.log(summary);
    // console.log(map);

    req.session.tournament = map[0].uuid;

}

interface TournamentReadQuery {
    id: number;
};

export async function login(req: Request) : Promise<void> {

    const id: number = req.body.id;
    const pwd: string = req.body.password;

    if (!id) { throw new OpenBracketError("No tournament specified") };
    if (!pwd) { throw new OpenBracketError("Incorrect password", 401) };

    const queryParams : TournamentReadQuery = {
        id: id
    }

    const query : string = `\
MATCH (t:Tournament) WHERE t.uuid = $id
RETURN t`

    const { keys, records, summary } = await db.driver.executeQuery(
        query, queryParams, { database: cfg.neo4jdbname }
    )

    const map = records.map<TournamentProperties>(function (record) : TournamentProperties {
        return record.get("t")
    });

    const pwdHash = security.hashPassword(pwd+map[0].salt)

    if (pwdHash != map[0].passwordHash) {
        throw new OpenBracketError("Incorrect password", 401)
    }

    req.session.tournament = map[0].uuid;

}

export async function read(req: Request) : Promise<OBTournament> {
    
    const id: number = req.body.id;

    if (!id) { throw new OpenBracketError("No tournament specified") };

    const queryParams : TournamentReadQuery = {
        id: id
    }

    const query : string = `\
MATCH (t:Tournament)-[:HAS_MATCH*1..8]->(m:Match) WHERE t.uuid = $id
OPTIONAL MATCH (t)-[:HAS_MATCH]->(rm:Match)
OPTIONAL MATCH (m)-[hasresult:HAS_RESULT]->(p:Participant)
OPTIONAL MATCH (m)-[hasmatch:HAS_MATCH]->(m2:Match)
RETURN t, rm, m, hasmatch, m2, hasresult, p`

    const { keys, records, summary } = await db.driver.executeQuery(
        query, queryParams, { database: cfg.neo4jdbname }
    )

    const tournament : TournamentProperties = records[0].get("t").properties
    const rootMatch : MatchProperties = records[0].get("rm").properties

    const participantHashTable : HashTable<boolean> = {};
    const matchStack: OBMatch[] = [];

    const res : OBTournament = {
        id: tournament.uuid,
        name: tournament.name,
        rootMatch: nullmatch,
        participants: []
    }

    matchStack.push({id: rootMatch.uuid});

    for (let record of records) {
        const parentMatch : MatchProperties = record.get("m").properties

        if (record.get("m2")) {
            const match : MatchProperties = record.get("m2").properties
            const matchRel : HasMatchProperties = record.get("hasmatch").properties

            let matchFound = false;
            let tempMatch : OBMatch;
            for (let match_ of matchStack) {
                if (matchFound) { continue };
                if (match_.id == match.uuid) {
                    matchFound = true;
                }
            }
    
            if (!matchFound) {
                tempMatch = {
                    id: match.uuid,
                    parentId: parentMatch.uuid,
                    type: matchRel.type
                }
                matchStack.push(tempMatch);
            }
        }

        if (record.get("p")) {
            const participant : ParticipantProperties = record.get("p").properties
            const result : HasResultProperties = record.get("hasresult").properties

            if (!participantHashTable[participant.uuid]) {
                participantHashTable[participant.uuid] = true;
                res.participants.push({id: participant.uuid, name: participant.name})
            }
    
            let isParticipantUpper = (result.type == "upper") ? true : false;
    
            let tempResult : OBParticipantScorePair = {
                participantId: participant.uuid,
                score: (result.score) ? result.score : undefined 
            }
    
            let parentMatchFound = false;
            for (let match_ of matchStack) {
                if (parentMatchFound) { continue };
                if (match_.id == parentMatch.uuid) {
                    if (isParticipantUpper) { match_.resultUpper = tempResult } else { match_.resultLower = tempResult };
                    parentMatchFound = true;
                }
            }
        }
    }

    while (matchStack.length > 1) {
        let match : OBMatch | undefined = matchStack.pop()
        if (!match) {
            throw new OpenBracketError("Critical internal error", 500);
        }
        let isMatchUpper = (match.type == "upper") ? true : false;

        let matchFound = false;
        for (let match_ of matchStack) {
            if (matchFound) { continue };
            if (match_.id == match.parentId) {
                match.parentId = undefined;
                if (isMatchUpper) { match_.matchUpper = match } else { match_.matchLower = match };
                matchFound = true;
            }
        }
    }
    res.rootMatch = matchStack[0];

    // console.log(records)
    // console.log(res)

    return res

}
