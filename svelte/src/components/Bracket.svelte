<div id="rounds" class="flex flex-row my-4 mx-4">
    {#each parsedBracket.roundNames as roundName}
        <div class="w-[270px] h-9 text-2xl leading-[38px] text-white bg-ob-light rounded-full text-center mr-10">
            <p>{roundName}</p>
        </div>
    {/each}
</div>
<div id="matches" class="flex flex-row my-4 mx-4">
    {#each parsedBracket.matches as round, i}
        <div class="w-[270px] h-screen mr-10">
            {#each round as match, j}
                <div id={`r_${i}_m_${j}`} class="mb-12 w-[270px] h-18" on:click={() => match_modal_up(i, j)}>
                    {#if match}
                        <div class="flex flex-row w-[270px] h-9 text-2xl leading-[38px] text-white bg-ob-gray rounded-full text-left">
                            <p class="w-[234px] pl-2">{match.resultUpper ? match.resultUpper.participantName : ""}</p>
                            <div class="right-0 min-w-9 min-h-9 leading-[36px] rounded-full bg-white text-ob-gray text-center border-ob-gray border-2">
                                {match.resultUpper && match.resultUpper.score ? match.resultUpper.score : ""}
                            </div>
                        </div>
                        <div class="flex flex-row w-[270px] h-9 text-2xl leading-[38px] text-white bg-ob-light rounded-full text-left">
                            <p class="w-[234px] pl-2">{match.resultLower ? match.resultLower.participantName : ""}</p>
                            <div class="ml-2.5 min-w-9 min-h-9 leading-[36px] rounded-full bg-white text-ob-gray text-center border-ob-light border-2">
                                {match.resultLower && (typeof match.resultLower.score == "number") ? match.resultLower.score : ""}
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/each}
</div>
<div id="match_modal" class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 z-20 hidden">
    <div class="grid w-[420px] h-screen place-items-center mx-auto">
        <div class="bg-ob-gray w-full h-[240px] rounded-[48px]">
            <p class="relative text-2xl text-white text-center align-middle w-420px h-8 top-5 left-0 mx-12">Report Score</p>
            <div class="grid gap-2 mt-6 mb-2 grid-cols-3">
                <p class="text-2xl text-white text-left align-middle pl-4 py-2">{mPlayer1}</p>
                <input type="text" id="m_upperscore" class="w-auto mr-4 h-6 my-auto col-span-2"/>
                <p class="text-2xl text-white text-left align-middle pl-4 py-2">{mPlayer2}</p>
                <input type="text" id="m_lowerscore" class="w-auto mr-4 h-6 my-auto col-span-2"/>
            </div>
            <div class="flex flex-row w-full my-4 items-center justify-center">
                <button 
                    class="text-2xl text-ob-gray text-center align-middle bg-white border-4 border-white hover:bg-opacity-90 h-12 w-3/4 px-4 py-2 mx-8 rounded-full"
                    on:click={() => report()}>
                    Submit
                </button>
            </div>
        </div>
    </div>
</div>

<script>
    import cfg from "../../obconfig.json";
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    export let parsedBracket = {
        roundNames: [],
        matches: [[]]
    };

    let mPlayer1 = "Player 1";
    let mPlayer2 = "Player 2";
    let focusMatch;

    onMount(() => {
        const roundsCount = parsedBracket.roundNames.length;
        for (let i = 1; i<roundsCount; i++) {
            for (let j = 0; j < parsedBracket.matches[i].length; j++) {
                let match = document.getElementById(`r_${i}_m_${j}`)
                let mTop = ((Math.pow(2,i)*120-48)/2)-36
                // @ts-ignore
                match.classList.remove("mb-12")
                // @ts-ignore
                match.style.marginTop = `${mTop}px`
                // @ts-ignore
                match.style.marginBottom = `${mTop*2+48}px`
                //
            }
        }

        window.onclick = function (event) {
            if (event.target == document.getElementById("match_modal"))
                match_modal_down();
        }
    })

    // @ts-ignore
    export function match_modal_up(round, match) {
        // @ts-ignore
        focusMatch = parsedBracket.matches[round][match]
        if (focusMatch.resultUpper && focusMatch.resultLower && !focusMatch.resultUpper.score && !focusMatch.resultLower.score) {
            mPlayer1 = focusMatch.resultUpper.participantName;
            mPlayer2 = focusMatch.resultLower.participantName;
        // @ts-ignore
        document.getElementById("match_modal").style.display = "block";
        }
    }

    export function match_modal_down() {
        // @ts-ignore
        document.getElementById("match_modal").style.display = "none";
    }

    export function report() {

        const data = {
            // @ts-ignore
            id: focusMatch.id,
            // @ts-ignore
            scoreUpper: Number(document.getElementById("m_upperscore").value),
            // @ts-ignore
            scoreLower: Number(document.getElementById("m_lowerscore").value),
        };

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Expose-Headers': 'Set-Cookie'
            },
            credentials: 'include',
            body: JSON.stringify(data),
        };

        fetch(`${cfg["obapi-url"]}/tournament`, requestOptions)
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
                            window.location.replace(`/view/${$page.params.id}`);
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

</script>