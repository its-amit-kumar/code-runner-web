const fetch = require('node-fetch')
const m = {
    Code: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n\tcout<<\"Hello World\";\n\n}\n",
    TimeLimit: 1,
    MemoryLimit:100000,
    Language: "cpp",
    Input: "aa"
}

for(var i= 0; i<5; i++){
const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(m),
    };
    fetch("http://localhost:5000/submitCode", 
    options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err))
}