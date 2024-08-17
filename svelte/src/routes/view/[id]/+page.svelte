<div class="fixed top-0 left-0 w-[21.875%] xl:w-[420px] h-full overflow-y-auto text-center text-white bg-ob-gray">
    <div id="mainimg" class="w-full py-4 my-4">
        <img class="object-contain w-1/3 mx-auto" src="\logo-white-tp.png" alt="OpenBracket Logo">
    </div>
    <div class="flex flex-row w-full my-6">
        <button 
            class="text-2xl leading-[52px] text-ob-gray text-center align-middle bg-white border-4 border-white hover:bg-opacity-90 h-18 w-3/4 px-4 py-2 mx-12 rounded-full"
            on:click={() => login_modal_up()}>
            Log In As Admin
        </button>
    </div>
    <div class="flex flex-row w-full my-6">
        <button
            class="text-2xl leading-[52px] text-white text-center align-middle bg-ob-gray border-4 border-white hover:bg-white hover:bg-opacity-10 h-18 w-3/4 px-4 py-2 mx-12 rounded-full"
            on:click={() => t_export()}>
            Export Tournament
        </button>
    </div>
    <div class="absolute w-full bottom-0">
        <div class="flex flex-row w-full my-6">
            <a 
                class="btn text-2xl leading-[52px] text-ob-gray text-center align-middle bg-white border-4 border-white hover:bg-opacity-90 h-18 w-3/4 px-4 py-2 mx-12 rounded-full"
                href="/create">
                Create Tournament
            </a>
        </div>
        <div class="flex flex-row w-full my-6">
            <a 
                class="btn text-2xl leading-[52px] text-white text-center align-middle bg-ob-gray border-4 border-white hover:bg-white hover:bg-opacity-10 h-18 w-3/4 px-4 py-2 mx-12 rounded-full"
                href="/import">
                Import Tournament</a>
        </div>
    </div>
</div>
<div id="bracket" class="top-0 mx-[21.875%] w-[78.125%] xl:w-[100%-420px] xl:mx-[420px] bg-white">
    {#key parsedBracket}
        <Bracket {parsedBracket}></Bracket>
    {/key}
</div>
<div id="login_modal" class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 z-20 hidden">
    <div class="grid w-[420px] h-screen place-items-center mx-auto">
        <div class="bg-ob-gray w-full h-[192px] rounded-[48px]">
            <p class="relative text-2xl text-white text-center align-middle w-420px h-8 top-5 left-0 mx-12">Log In As Admin</p>
            <div class="grid gap-6 mt-6 mb-4 grid-cols-3">
                <p class="text-2xl text-white text-left align-middle pl-4 py-2">Password</p>
                <input type="password" id="t_password" class="w-auto mr-4 h-6 my-auto col-span-2"/>
            </div>
            <div class="flex flex-row w-full my-4 items-center justify-center">
                <button 
                    class="text-2xl text-ob-gray text-center align-middle bg-white border-4 border-white hover:bg-opacity-90 h-12 w-3/4 px-4 py-2 mx-8 rounded-full"
                    on:click={() => login()}>
                    Submit
                </button>
            </div>
        </div>
    </div>
</div>

<svelte:head>
    <title>OpenBracket - View</title>
    <style>
        :root {
            background-color: white;
        }
        div {
            font-family: 'Bahnschrift';
        }
    </style>
</svelte:head>

<script>
    import cfg from "../../../../obconfig.json";
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import Bracket from '../../../components/Bracket.svelte';

    export function login_modal_up() {
        document.getElementById("login_modal").style.display = "block";
    }

    export function login_modal_down() {
        document.getElementById("login_modal").style.display = "none";
    }

    export function login() {

        const data = {
            // @ts-ignore
            id: $page.params.id,
            // @ts-ignore
            password: document.getElementById("t_password").value,
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Expose-Headers': 'Set-Cookie'
            },
            credentials: 'include',
            body: JSON.stringify(data),
        };

        fetch(`${cfg["obapi-url"]}/tournament/login`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    // @ts-ignore
                    response.json()
                        .then(val => {
                            throw new Error(val.flavor);
                        })
                        .catch(error => {
                            throw new Error("Response not OK (unknown)");
                        })
                }
                else {
                    response.json()
                        .then(val => {
                            window.location.replace(`/admin/${$page.params.id}`);
                        })
                        .catch(error => {
                            throw new Error("Response JSON malformed");
                        })
                }
            })
            .catch(error => {
                console.error(error);
            })

    }

    // @ts-ignore
    let bracket;

    export function t_export() {
        // @ts-ignore
        const blob = new Blob([JSON.stringify(bracket, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${$page.params.id}.json`;
        a.click();
        URL.revokeObjectURL(url);

    }

    // @ts-ignore
    let roundNames = [];
    // @ts-ignore
    let matches = [];
    $: parsedBracket = {
        // @ts-ignore
        roundNames: roundNames,
        // @ts-ignore
        matches: matches
    }

    // @ts-ignore
    export function parseBracket(b) {

        let rounds = 1;
        const rMatch = b.rootMatch;
        let m = rMatch

        while (m.matchUpper) {
            rounds++;
            m = m.matchUpper
        }
        if (m.matchLower) {
            rounds++;
        }

        roundNames = [];
        matches = [];

        for (let i=1; i<=rounds; i++) {
            roundNames.push(`Round ${i}`)
            matches.push([]);
        }

        roundNames[roundNames.length-1] = "Grand Final"

        if (roundNames.length >= 2) {
            roundNames[roundNames.length-2] = "Semifinals"
        }

        // @ts-ignore
        matches = parseMatches(rMatch, matches, 0)

        for (let round = 0; round < roundNames.length; round++) {
            for (let match = 0; match < matches[round].length; match++) {
                if (matches[round][match].resultUpper) {
                    matches[round][match].resultUpper["participantName"] = convertIdToParticipant(matches[round][match].resultUpper["participantId"], b.participants)
                }
                if (matches[round][match].resultLower) {
                    matches[round][match].resultLower["participantName"] = convertIdToParticipant(matches[round][match].resultLower["participantId"], b.participants)
                }
            }
        }

    }

    // @ts-ignore
    export function convertIdToParticipant(id, participants) {
        for (let p of participants) {
            if (p.id == id) {
                return p.name
            }
        }
    }

    // @ts-ignore
    export function parseMatches(m, matches, depth) {
        matches[matches.length-1-depth].push(m)
        if (m.matchUpper) {
            matches = parseMatches(m.matchUpper, matches, depth+1)
        } else if (depth != matches.length-1) {
            matches[matches.length-2-depth].push(0)
        }
        if (m.matchLower) {
            matches = parseMatches(m.matchLower, matches, depth+1)
        } else if (depth != matches.length-1) {
            matches[matches.length-2-depth].push(0)
        }
        return matches
    }

    onMount(() => {

        window.onclick = function (event) {
            if (event.target == document.getElementById("login_modal"))
                login_modal_down();
        }

        if (!$page.params.id) {
            window.location.replace(`/`);
        }

        const params = {id: $page.params.id}

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };

        // @ts-ignore
        fetch(`${cfg["obapi-url"]}/validate?` + new URLSearchParams(params), requestOptions)
                .then(response => {
                    if (response.ok) {
                        window.location.replace(`/admin/${$page.params.id}`);
                    }
                    // @ts-ignore
                    fetch(`${cfg["obapi-url"]}/tournament?` + new URLSearchParams(params), requestOptions)
                            .then(response => {
                                if (!response.ok) {
                                    // @ts-ignore
                                    response.json()
                                        .then(val => {
                                            throw new Error(val.flavor);
                                        })
                                        .catch(error => {
                                            throw new Error("Response not OK (unknown)");
                                        })
                                }
                                response.json()
                                    .then(val => {
                                        bracket = val;
                                        parseBracket(bracket);
                                    })
                            })
                })
                .catch(error => {
                    console.error(error);
                })
    })
</script>