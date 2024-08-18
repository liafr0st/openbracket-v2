<div class="flex flex-row max-w-xl md:mx-auto my-3.5">
    <div id="mainimg" class="h-1/6 w-full py-4">
        <img class="object-contain mx-auto" src="\textmark-white.png" alt="OpenBracket Textmark">
    </div>
</div>
<div class="flex flex-row max-w-xl md:mx-auto my-3.5 items-center justify-center">
    <p class="text-4xl text-white text-center align-middle h-10 w-480px px-4 py-2 mx-12">Import Tournament</p>
</div>
<div class="flex flex-row max-w-xl md:mx-auto mb-3.5">
    <div id="mainimg" class="h-1/6 w-full py-4">
        <img class="object-contain mx-auto w-1/3" src="\OBfileicon-white.png" alt="OpenBracket JSON file">
    </div>
</div>
<div class="flex flex-row max-w-xl md:mx-auto my-3.5 mb-[38px]">
    <button class="w-full h-6 bg-white text-ob-gray" on:click={() => document.getElementById('i_file').click()}>Upload exported tournament JSON file</button>
    <input type="file" id="i_file" class="w-full h-6 my-auto hidden" style="tabindex:-1" accept=".json"/>
</div>
<div class="flex flex-row max-w-xl md:mx-auto my-3.5 items-center justify-center">
    <button 
        id="publish" 
        class="text-4xl leading-[52px] text-ob-gray text-center align-middle bg-white border-4 border-white hover:bg-opacity-90 h-18 w-480px px-4 py-2 mx-12 rounded-full"
        on:click={() => view()}>
        View Tournament
    </button>
</div>
<div class="flex flex-row max-w-xl md:mx-auto my-3.5 items-center justify-center">
    <a 
        class="btn text-4xl leading-[52px] text-white text-center align-middle bg-ob-gray border-4 border-white hover:bg-white hover:bg-opacity-10 h-18 w-480px px-4 py-2 mx-12 rounded-full" 
        href="/">
        Go Back
    </a>
</div>

<svelte:head>
    <title>OpenBracket - Import</title>
    <style>
        :root {
            background-color: #333333;
        }
        div {
            font-family: 'Bahnschrift';
        }
    </style>
</svelte:head>

<script>
    import { writable } from 'svelte/store'
    import { browser } from '$app/environment'

    /*
    Reference: https://stackoverflow.com/a/66387148/12102132
    Published: 26/02/2021
    Retrived: 18/08/2024
    */
    // @ts-ignore
    async function parseJsonFile(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.onload = event => resolve(JSON.parse(event.target.result))
            fileReader.onerror = error => reject(error)
            fileReader.readAsText(file)
        })
    }

    export function view() {
        
        // @ts-ignore
        parseJsonFile(document.getElementById("i_file").files[0])
            .then(function (parsed) {
                console.log(parsed)
                const bracket = writable(JSON.stringify(parsed))
                bracket.subscribe((value) => {
                    if (browser) return (localStorage.bracket = value)
                })
                window.location.replace("/view/import")
            })
            .catch((error) => {
                throw new Error("Could not import JSON");
            })
    }
</script>