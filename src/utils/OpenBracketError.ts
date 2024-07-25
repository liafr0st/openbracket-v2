import { Neo4jError } from "neo4j-driver";

export class OpenBracketError extends Error {
    code: number;
    flavor: string;
    constructor(m?: string, code?: number) {
        let tempcode = 400;
        if (!m) {
            m = "";
            tempcode = 200;
        }
        if (code) {
            tempcode = code;
        }
        super(m)
        this.name = "OpenBracketError";
        this.flavor = this.message;
        this.code = tempcode;
        Object.setPrototypeOf(this, OpenBracketError.prototype);
    }
}

export function identifyError(e: unknown): OpenBracketError {
    if (e instanceof OpenBracketError) {
        return e;
    }
    let tempcode = 500;
    let msg;
    if (e instanceof Error) {
        if (e instanceof Neo4jError) {
            if (e.code === "Neo.ClientError.Schema.ConstraintValidationFailed") {
                tempcode = 409;
            }
        }
        // console.error(e)
        msg = e.message
    } else {
        console.error(e)
        msg = "Unknown error";
    }
    return new OpenBracketError(msg, tempcode);
}
