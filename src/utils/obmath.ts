import { BracketStructure } from "./types";

/*
Reference: https://stackoverflow.com/a/12646864
Published: 31/08/2015 - https://stackoverflow.com/users/310500/laurens-holst
Retrieved: 26/07/2024
*/
export function shuffleParticipants(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

export function bracketStructure(count: number) : BracketStructure {

    const rounds : number = Math.ceil(Math.log(count)/Math.log(2));
    const positionsBySeed : number[] = new Array(count).fill(-1);
    const positions : number[] = new Array(Math.pow(2,rounds)).fill(-1);
    
    positionsBySeed[0] = 0;
    positions[0] = 0;
    for (let i = 1; i < count; i++) {
        let j = Math.floor(Math.log(2)/Math.log(i));
        let k = rounds-j-1;

        let maxpoint : number = Math.pow(2,j+1)-1;
        positionsBySeed[i] = positionsBySeed[maxpoint-i]+Math.pow(2,k)
        positions[positionsBySeed[maxpoint-i]+Math.pow(2,k)] = i

    }

    const res : BracketStructure = {
        rounds: rounds,
        positions: positions
    }

    return res;

}