"use strict";

const runBtn = document.getElementById("form");
const tickerForm = document.getElementById('v');
const scrapeBtn = document.getElementById('scrape_btn');
const addManualBtn = document.getElementById('addManualBtn');

function play() {
  var audio = new Audio('static/sound.wav');
  audio.play();
}

// if (runBtn) {
//   runBtn.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const result = document.getElementById('result').querySelector('tbody');
//     e.preventDefault(); //pervent refresh page on submit
//     result.innerHTML = "<tr><td colspan='7'>LOADING</td></tr>";
//     const statusMessage = document.createElement('img');
//     statusMessage.src = "static/spinner.svg";
//     statusMessage.style.cssText = `
//                 display:block;
//                 margin:0 auto;
//             `;
//     result.insertAdjacentElement('beforebegin', statusMessage);

//     let tickerName = tickerForm.value;
//     console.log(tickerForm.value);
//     if (tickerForm.value == false) {
//       tickerName = "MCD";
//       alert("Please Fill Ticker Field");
//     }

//     const results = await fetchTheServer('get', '/getdata/' + tickerName);
//     // console.log(results);
//     // const results = mockData;

//     let array = '';

//     for (let i = 0; i < results.length; i++) {
//       let timestamp = results[i].date;
//       let ticker = tickerName.toUpperCase();
//       let open = results[i].open;
//       let high = results[i].high;
//       let low = results[i].low;
//       let close = results[i].close;
//       let vol = results[i].volume;
//       let tr = createTr(timestamp, ticker, open, high, low, close, vol);
//       array += tr;
//       // console.log(array);
//     }
//     result.innerHTML = array;
//   });
// }

function createTr(t, n, o, h, l, c, v) {
  return "<tr><td>" + t + "</td><td>" + n + "</td><td>" + o + "</td><td>" + h + "</td><td>" + l + "</td><td>" + c + "</td><td>" + v + "</tr>";
}

async function fetchTheServer(method, route, body = null) {
  let response = await fetch(route, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: method,
    body: body
  })
  return await response.json();
};

const mockData = [
  {
    "timestamp": "2018-01-01",
    "ticker": "SLS",
    "open": 4,
    "high": 5,
    "low": 6,
    "close": 9,
    "volume": 87654678
  },
  {
    "timestamp": "2018-02-01",
    "ticker": "SLS",
    "open": 4,
    "high": 5,
    "low": 6,
    "close": 9,
    "volume": 87654678
  },
  {
    "timestamp": "2018-03-01",
    "ticker": "SLS",
    "open": 4,
    "high": 5,
    "low": 6,
    "close": 9,
    "volume": 87654678
  }
];

//Login page

const submitBtn = document.getElementById('login');
const passwordForm = document.getElementById('password');
const usernameForm = document.getElementById('username');
const logResults = document.getElementById('log_results');
const logsDelBtn = document.getElementById('LogsDel');
const column1 = document.getElementById('inside');
const column2 = document.getElementById('col2');
const column3 = document.getElementById('col3');
const column4 = document.getElementById('col4');
const box1 = document.getElementById('sbox1');


//REAL TIME DATA END//

if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    // e.preventDefault();
    const password = passwordForm.value;
    const username = usernameForm.value;
    console.log(username, password);
  });
}

// websocket part start
function createTrForWs(t,o,h,l,c, v) {
  return "<tr><td>" + t + "</td><td>" + o + "</td><td>" + h + "</td><td>" +l + "</td><td>" +c+ "</td><td>"+ "{{ '{:,.0f}'.format("+v+") }}"+ "</tr>";
}

function deleterow(tableID) {
  var table = document.getElementById(tableID);
  var rowCount = table.rows.length;
  console.log(rowCount);
  if (rowCount>10){
  table.deleteRow(rowCount -12);
}}

// Create WebSocket connection.
function WebSocketTest() {
            
  if ("WebSocket" in window) {
    //  alert("WebSocket is supported by your Browser!");
     
     // Let us open a web socket
     var ws = new WebSocket("ws://localhost:8080");
     console.log(ws.readyState);

     ws.onopen = function() {
        
        // Web Socket is connected, send data using send()
        ws.send("HELLO SERVER");
        console.log("HELLO SERVER");
        console.log(ws.readyState);
     };

     ws.onmessage = function (evt) { 
        var received_msg = evt.data;
        // alert("Message is received..."+received_msg);

        if (column1) {
          let results = JSON.parse(received_msg);
          const result = document.getElementById("tbody");
          console.log(results);
          // console.log("got element", result);
          let array = '';
          //t,o,h,l,c,v
          let tr = createTrForWs(results.time,0,0,0,results.lastprice, results.volume);
          array += tr;
          // result.innerHTML += array;
          result.insertAdjacentHTML("afterbegin",array); //newest element always on top
          sbox1.innerHTML=results.symbol;
          deleterow("table1");
          }
     };

     

     ws.onclose = function() {      
        // websocket is closed.
        console.log("Connection is closed..."); 
        console.log(ws.readyState);
     };
  } else {
    
     // The browser doesn't support WebSocket
     alert("WebSocket NOT supported by your Browser!");
  }
}

if (column1) {
WebSocketTest();
}


// websocket part end
// socket.close();


if (scrapeBtn) {
  scrapeBtn.addEventListener('click', async (e) => {
    console.log('scrape');
    play();
    const statusMessage = document.createElement('img');
    const result = document.getElementById('result').querySelector('tbody');
    statusMessage.src = "static/spinner.svg";
    statusMessage.style.cssText = `
              display:block;
              margin:0 auto;
              allign-items:centre;
            `;
    // 'beforebegin' : Before the targetElement itself.
    // 'afterbegin' : Just inside the targetElement , before its first child.
    // 'beforeend' : Just inside the targetElement , after its last child.
    // 'afterend' : After the targetElement itself.
    result.insertAdjacentElement('beforebegin', statusMessage);
    await fetchTheServer('get', "/scrape");
    location.reload();
  });
}

if (addManualBtn) {
  addManualBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    let ticker = tickerForm.value;
    console.log(`scrape manual add ${ticker}`);
    play();
    const statusMessage = document.createElement('img');
    const result = document.getElementById('result').querySelector('tbody');
    statusMessage.src = "static/spinner.svg";
    statusMessage.style.cssText = `
              display:block;
              margin:0 auto;
              allign-items:centre;
            `;
    // 'beforebegin' : Before the targetElement itself.
    // 'afterbegin' : Just inside the targetElement , before its first child.
    // 'beforeend' : Just inside the targetElement , after its last child.
    // 'afterend' : After the targetElement itself.
    result.insertAdjacentElement('beforebegin', statusMessage);
    await fetchTheServer('get', "/scrape/" + ticker);
    location.reload();
  });
}

if (logsDelBtn) {
  logsDelBtn.addEventListener('click', async (e) => {
    console.log('Logs File Removal');
    await fetchTheServer('get', "/deletelogs");
    location.reload();
  });
}

function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
//sort columns by clicking on them

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }


  
}
