# OpenBracket

An open source implementation of a competition management platform, originally for a university final year project.

## Prerequisites

- Neo4J License

## Startup

- Create `OpenBracket` DBMS and `openbracketdb` database in Neo4J
- Modify `neo4j.conf` (under your Neo4J data path) - add `dbms.cypher.lenient_create_relationship=true`
- Start `OpenBracket` DBMS
- Open two terminal windows
- In `openbracket-v2/` run `npm run start`, with `npm run build` immediately before if this is a first launch or after modifications.
- In `openbracket-v2/svelte` run `npm run dev`