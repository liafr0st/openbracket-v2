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
    <title>OpenBracket - Admin</title>
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

    onMount(() => {

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

        let bracket;

        // @ts-ignore
        fetch(`${cfg["obapi-url"]}/validate?` + new URLSearchParams(params), requestOptions)
                .then(response => {
                    if (!response.ok) {
                        // @ts-ignore
                        response.json()
                            .then(val => {
                                if (val.code != 401) {
                                    throw new Error(val.flavor);
                                }
                                window.location.replace(`/view/${$page.params.id}`);
                            })
                            .catch(error => {
                                throw new Error("Response not OK (unknown)");
                            })
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
                                })
                        })
                })
                .catch(error => {
                    console.error(error);
                })
        
        console.log(bracket)

    })
</script>