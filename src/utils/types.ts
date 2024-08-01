export interface BracketStructure {
    rounds: number;
    positions: number[];
}

export interface TournamentProperties {
    name: string;
    passwordHash: string;
    salt: string;
    uuid: string;
}

export interface MatchProperties {
    uuid: string;
}

export interface HasMatchProperties {
    type: "upper" | "lower";
}

export interface ParticipantProperties {
    uuid: string;
    name: string;
}

export interface HasResultProperties {
    type: "upper" | "lower";
    score?: number;
}

export interface OBTournament {
    id: string;
    name: string;
    rootMatch: OBMatch;
    participants: OBParticipant[];
}

export interface OBMatch {
    id: string;
    resultUpper?: OBParticipantScorePair;
    resultLower?: OBParticipantScorePair;
    matchUpper?: OBMatch;
    matchLower?: OBMatch;
    parentId?: string;
    type?: "upper" | "lower";
}

export interface OBParticipant {
    id: string;
    name: string;
}

export interface OBParticipantScorePair {
    participantId: string;
    score?: number;
}

/*
Reference: https://stackoverflow.com/a/18984413
Published: 24/09/2013 - https://stackoverflow.com/users/121983/ross-scott
Retrieved: 30/07/2024
*/
export interface HashTable<T> {
    [key: string]: T;
}

declare module "express-session" {
    interface SessionData {
        tournament?: string;
    }
}