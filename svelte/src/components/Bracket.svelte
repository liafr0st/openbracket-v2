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
                <div id={`r${i}m${j}`} class="mb-12 w-[270px] h-18">
                    {#if match}
                        <div class="flex flex-row w-[270px] h-9 text-2xl leading-[38px] text-white bg-ob-gray rounded-full text-left">
                            <p class="w-[234px] pl-2">{match.resultUpper ? match.resultUpper.participantName : ""}</p>
                            <div class="right-0 min-w-9 min-h-9 rounded-full bg-white text-ob-gray text-center border-ob-gray border-2">
                                {match.resultUpper && match.resultUpper.score ? match.resultUpper.score : ""}
                            </div>
                        </div>
                        <div class="flex flex-row w-[270px] h-9 text-2xl leading-[38px] text-white bg-ob-light rounded-full text-left">
                            <p class="w-[234px] pl-2">{match.resultLower ? match.resultLower.participantName : ""}</p>
                            <div class="ml-2.5 min-w-9 min-h-9 rounded-full bg-white text-ob-gray text-center border-ob-light border-2">
                                {match.resultLower && (typeof match.resultLower.score == "number") ? match.resultLower.score : ""}
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/each}
</div>

<script>
    import { onMount } from 'svelte';

    export let parsedBracket = {
        roundNames: [],
        matches: [[]]
    };

    onMount(() => {
        const roundsCount = parsedBracket.roundNames.length;
        for (let i = 1; i<roundsCount; i++) {
            for (let j = 0; j < parsedBracket.matches[i].length; j++) {
                let match = document.getElementById(`r${i}m${j}`)
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
    })
</script>