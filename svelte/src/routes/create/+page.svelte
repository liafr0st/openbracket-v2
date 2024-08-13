<div class="flex flex-row max-w-xl md:mx-auto my-3.5">
    <div id="mainimg" class="h-1/6 w-full py-4">
        <img class="object-contain mx-auto" src="\textmark-white.png" alt="OpenBracket Textmark">
    </div>
</div>
<div class="flex flex-row max-w-xl md:mx-auto my-3.5 items-center justify-center">
    <p class="text-4xl text-white text-center align-middle h-18 w-480px px-4 py-2 mx-12">Create Tournament</p>
</div>
<div class="flex flex-row max-w-xl md:mx-auto my-3.5">
    <div class="grid gap-6 mb-6 grid-cols-2">
        <p class="text-2xl text-white text-left align-middle px-4 py-2">Tournament name</p>
        <input type="text" id="t_name" class="w-full h-6 my-auto"/>
        <p class="text-2xl text-white text-left align-middle px-4 py-2">Set a password</p>
        <input type="password" id="t_password" class="w-full h-6 my-auto"/>
        <p class="text-2xl text-white text-left align-middle my-auto px-4 py-2">Participants<br/>(one per line)</p>
        <textarea id="t_participants" class="w-full h-[144px]"/>
        <p class="text-2xl text-white text-left align-middle px-4 py-2">Are participants ordered by seed?</p>
        <input type="checkbox" id="t_seeded" class="w-[16px] mx-auto"/>
    </div>
</div>
<div class="flex flex-row max-w-xl md:mx-auto my-3.5 items-center justify-center">
    <button id="publish" class="text-4xl leading-[52px] text-ob-gray text-center align-middle bg-white border-4 border-white hover:bg-opacity-90 h-18 w-480px px-4 py-2 mx-12 rounded-full" on:click={() => publish()}>Publish Tournament</button>
</div>
<div class="flex flex-row max-w-xl md:mx-auto my-3.5 items-center justify-center">
    <a class="btn text-4xl leading-[52px] text-white text-center align-middle bg-ob-gray border-4 border-white hover:bg-white hover:bg-opacity-10 h-18 w-480px px-4 py-2 mx-12 rounded-full" href="/">Go Back</a>
</div>

<style lang="postcss">
    :global(html) {
      background-color: #333333;
    }
    :global(div) {
        font-family: 'Bahnschrift';
    }
</style>

<script>
    import cfg from "../../../obconfig.json";
    export function publish() {

        const data = {
            // @ts-ignore
            name: document.getElementById("t_name").value,
            // @ts-ignore
            password: document.getElementById("t_password").value,
            // @ts-ignore
            participants: document.getElementById("t_participants").value,
            // @ts-ignore
            isSeeded: document.getElementById("t_seeded").checked
        };

        console.log(data)

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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
                            window.location.replace(`/admin?id=${val.id}`);
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