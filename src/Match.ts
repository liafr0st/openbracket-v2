import { Request } from 'express';
import { OpenBracketError } from './utils/OpenBracketError';
import cfg from "../config.json";
import * as db from "./utils/db";

interface MatchUpdateQuery {
    id: string;
    tournamentId: string;
    scoreUpper: number;
    scoreLower: number;
}

export async function update(req : Request) : Promise<void> {

    const id: string = req.body.id;
    const tournamentId: string | undefined = req.session.tournament;
    let scoreUpper: number = req.body.scoreUpper;
    let scoreLower: number = req.body.scoreLower;

    if (!tournamentId) { throw new OpenBracketError("Not logged in", 401) };
    if (!id) { throw new OpenBracketError("No match specified") };
    if (!scoreUpper && !scoreLower) { throw new OpenBracketError("No scores specified") };

    if (!scoreUpper) { scoreUpper = 0 };
    if (!scoreLower) { scoreLower = 0 };

    const queryParams : MatchUpdateQuery = {
        id: id,
        tournamentId: tournamentId,
        scoreUpper: scoreUpper,
        scoreLower: scoreLower
    }

    let winner = "pUpper"

    if (scoreLower > scoreUpper) {
        winner = "pLower"
    } else if (scoreLower == scoreUpper) {
        throw new OpenBracketError("Participants are tied")
    }

    let query : string = `\
MATCH (t:Tournament)-[:HAS_MATCH*1..8]->(m:Match) WHERE t.uuid = $tournamentId AND m.uuid = $id
MATCH (pUpper:Participant)<-[upper:HAS_RESULT {type: "upper"}]-(m)-[lower:HAS_RESULT {type: "lower"} ]->(pLower:Participant)
MATCH (parentMatch:Match)-[hasmatch:HAS_MATCH]->(m)
SET upper.score = $scoreUpper
SET lower.score = $scoreLower
MERGE (parentMatch)-[:HAS_RESULT {type: hasmatch.type}]->(${winner})
RETURN pUpper, upper, m, lower, pLower, parentMatch`

    const { keys, records, summary } = await db.driver.executeQuery(
        query, queryParams, { database: cfg.neo4jdbname }
    )

    if (!records[0].get("m")) { throw new OpenBracketError("Not logged in or match does not exist", 401) }

}