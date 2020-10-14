import React from 'react';
import ReactDOM from 'react-dom';

import Missions from './components/Missions.js';

import schema from './schema.js';

const headers = [ "mission", "shuttle", "date" ];

const sampleData = [
{
  "mission": "1",
  "shuttle": "Challenger",
  "date": "6"
},
{
  "mission": "2",
  "shuttle": "Enterprise",
  "date": "7"
},
{
  "mission": "3",
  "shuttle": "Atlantis",
  "date": "8"
}
];

let data = JSON.parse(localStorage.getItem('data'));

if (!data) {
  data = sampleData;
/*
  // THEIR SUGGESTION FOR DEFAULT DATA
  data = {};
  schema.forEach(item => data[item.id] = item.sample);
  data = [ data ];
*/
}

ReactDOM.render(
  <main>
    <h1>NASA Mission Navigator</h1>
    <Missions headers={headers} schema={schema} initialData={data} />
  </main>,
  document.getElementById("react-app")
);
