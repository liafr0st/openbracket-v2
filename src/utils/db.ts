import neo4j, { EagerResult, Integer, Neo4jError, Node, Relationship, resultTransformers, ServerInfo } from 'neo4j-driver';
import cfg from "../../config.json";
import { identifyError, OpenBracketError } from './OpenBracketError';

export const driver = neo4j.driver(cfg.neo4juri, neo4j.auth.basic(cfg.neo4jusername, cfg.neo4jpassword));

export async function startup(): Promise<ServerInfo> {
    const srvInfo = await driver.getServerInfo({ database: cfg.neo4jdbname })
        .catch(e => {
            throw identifyError(e);
        })

    console.log(`Connection Successful:\n\tAddress: ${srvInfo.address}\n\tProtocol Version: ${srvInfo.protocolVersion}\n\tAgent: ${srvInfo.agent}`)

    // try {
    //     let dbres: EagerResult = await driver.executeQuery(
    //         `CREATE CONSTRAINT unq_username IF NOT EXISTS
    //         FOR (u:${cfg.neo4jtypenames.user}) REQUIRE u.name IS UNIQUE`, {}, { database: cfg.neo4jdbname }
    //     )
    //     dbres = await driver.executeQuery(
    //         `CREATE CONSTRAINT unq_email IF NOT EXISTS
    //         FOR (acc:${cfg.neo4jtypenames.linkedacct}) REQUIRE (acc.platform, acc.platformuid) IS UNIQUE`, {}, { database: cfg.neo4jdbname }
    //     )
    //     dbres = await driver.executeQuery(
    //         `CREATE CONSTRAINT unq_teamname IF NOT EXISTS
    //         FOR (team:${cfg.neo4jtypenames.team}) REQUIRE team.name IS UNIQUE`, {}, { database: cfg.neo4jdbname }
    //     )
    //     dbres = await driver.executeQuery(
    //         `CREATE CONSTRAINT unq_orgname IF NOT EXISTS
    //         FOR (org:${cfg.neo4jtypenames.org}) REQUIRE org.name IS UNIQUE`, {}, { database: cfg.neo4jdbname }
    //     )
    // }
    // catch (e) {
    //     throw identifyError(e);
    // }
    if (srvInfo instanceof ServerInfo) {
        return srvInfo;
    }
    throw new OpenBracketError("getServerInfo() completed without returning ServerInfo object", 500);
}

export async function shutdown() {
    await driver.close();
}
