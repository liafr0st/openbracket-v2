<div class="fixed top-0 left-0 w-[21.875%] xl:w-[420px] h-full overflow-y-auto text-center text-white bg-ob-gray">
    <div id="mainimg" class="w-full py-4 my-4">
        <img class="object-contain w-1/3 mx-auto" src="\logo-white-tp.png" alt="OpenBracket Logo">
    </div>
    <div class="flex flex-row w-full my-6">
        <button
            class="text-2xl leading-[52px] text-white text-center align-middle bg-ob-gray border-4 border-white hover:bg-white hover:bg-opacity-10 h-18 w-3/4 px-4 py-2 mx-12 rounded-full">
            Export Tournament
        </button>
    </div>
    <div class="flex flex-row w-full my-6">
        <button 
            class="text-2xl leading-[52px] text-white text-center align-middle bg-ob-gray border-4 border-white hover:bg-white hover:bg-opacity-10 h-18 w-3/4 px-4 py-2 mx-12 rounded-full">
            Export Participants
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
                Import Tournament
            </a>
        </div>
    </div>
</div>
<div class="top-0 mx-[21.875%] w-[78.125%] xl:w-[100%-420px] xl:mx-[420px] bg-white"></div>

<svelte:head>
    <style>
        :root {
            background-color: white;
        }
        div {
            font-family: 'Bahnschrift';
        }
    </style>
</svelte:head>
