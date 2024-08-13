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
    import cfg from "../../../obconfig.json";
    export function view() {

        console.log("View")
        // const data = {
        //     // @ts-ignore
        //     name: document.getElementById("t_name").value,
        //     // @ts-ignore
        //     password: document.getElementById("t_password").value,
        //     // @ts-ignore
        //     participants: document.getElementById("t_participants").value,
        //     // @ts-ignore
        //     isSeeded: document.getElementById("t_seeded").checked
        // };

        // console.log(data)

        // const requestOptions = {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // };

        // fetch(`${cfg["obapi-url"]}/tournament`, requestOptions)
        //     .then(response => {
        //         if (!response.ok) {
        //             // @ts-ignore
        //             response.json()
        //                 .then(val => {
        //                     throw new Error(val.flavor);
        //                 })
        //                 .catch(error => {
        //                     throw new Error("Response not OK (unknown)");
        //                 })
        //         }
        //         else {
        //             response.json()
        //                 .then(val => {
        //                     window.location.replace(`/admin?id=${val.id}`);
        //                 })
        //                 .catch(error => {
        //                     throw new Error("Response JSON malformed");
        //                 })
        //         }
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     })
    }
</script>