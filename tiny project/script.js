const continentSelect = document.getElementById("continent-select");

queryFetch( `
query{
  continents{
    code
    name
  }
}
`
)
.then(data=>{
  data.data.continents.forEach(continent=>{
    const option  = document.createElement("option");
    option.value = continent.code;
    option.innerHTML = continent.name;
    continentSelect.append(option);
  })
})

continentSelect.addEventListener('change', async e=>{
  const continentCode = e.target.value;
  const countries = await getContinentCountries(continentCode);
  console.log(countries)
})

function getContinentCountries(continentCode){
  return queryFetch(`
    query getCountries($code: ID!){
      continent(code: $code){
        countries{
          name
        }
      }
    }
  `, { code: continentCode }).then(data => {
    return data.data.continent.countries
  })
}

function queryFetch(query,variables){
  return fetch("https://countries.trevorblades.com/",{
    method:"POST",
    headers:{"Content-Type":"application/json" },
    body:JSON.stringify({
      query: query,
      variables:variables
    })
  })
  .then(res=>res.json())
}