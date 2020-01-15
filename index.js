const debounce = (func, delay) => {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  }
}
(function(){
  let movieData = [
    {
        "name": "Harrison Ford",
        "movie": "Star Wars",
        "character": "Han Solo",
        "movieRating": 8
    },
    {
        "name": "Carrie Fisher",
        "movie": "Star Wars",
        "character": "Princess Leia",
        "movieRating": 8,
        "profile": {
          "profession": "actress",
          "birthDate": "21 October 1956",
          "Nationality": " American"
        }
    },
    {
        "name": "Al Pacino",
        "movie": "The Godfather",
        "character": "Michael Corleone",
        "movieRating": 9
    },
    {
        "name": "Robert De Niro",
        "movie": "Goodfellas",
        "character": "Jimmy Conway",
        "movieRating": 7.8,
        "profile": {
          "profession": "Actor",
          "birthDate": "17 August 1943",
          "Nationality": " American",
          "spouseName": "Grace Hightower"
        }
    }
  ]
  const { thead, tbody } = displayTable(movieData);
  let table = document.querySelector('#movieTable');
  table.appendChild(thead);
  table.appendChild(tbody);
  // const box = paginator({
  //   table,
  //   getRows: document.querySelectorAll('tbody tr'),
  //   box: document.getElementById("index_native"),
  // });
  document.getElementById("myInput").addEventListener('input', debounce(searchTable, 200))
})();

// Remove sort attributes
function removeSortAttrs() {
  let header = document.querySelector("th[data-sortorder]");
  if (header) {
    header.lastElementChild.removeAttribute('class');
    header.removeAttribute('data-sortorder');
  }
};

function sortHeader(e) {
  if (e.target.type === 'text') { // filter input
    return;
  }
  let targetHeader = e.target;
  let isAsc = targetHeader.getAttribute('data-sortorder');
  let tdId = parseInt(targetHeader.getAttribute('id'));
  if (isAsc === 'asc') {
    targetHeader.lastElementChild.setAttribute('class', 'down');
    targetHeader.setAttribute('data-sortorder', 'desc')
  } else {
    removeSortAttrs();
    targetHeader.lastElementChild.setAttribute('class', 'up');
    targetHeader.setAttribute('data-sortorder', 'asc')
  }

  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("movieTable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("td")[tdId];
      y = rows[i + 1].getElementsByTagName("td")[tdId];
      //check if the two rows should switch place:
      if (
        (isAsc === null || isAsc === 'desc') && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase() ||
        isAsc === 'asc' && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()
        ) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}


function searchTable() {
  let inputValue = document.getElementById("myInput").value.toLowerCase().trim();
  if (inputValue !== '') {
    handleFilter();
    removeSortAttrs();
  }
};

function handleFilter() {
  let trs = document.querySelectorAll('tbody tr');
  let inputElements = document.querySelectorAll("input:not(#myInput)");
  let filteredInputElements = [...inputElements].filter(input => input.value.trim() !== '');
  inputValue = document.getElementById("myInput").value.toLowerCase().trim();

    let filteredTrs = [...trs].filter(tr => {
      let showSearchRow = inputValue !== '' ? tr.innerText.toLowerCase().includes(inputValue) : true;
      let showfilteredRow = filteredInputElements.every(input => {
        let filterId = parseInt(input.parentElement.id);
          return tr.childNodes[filterId].innerText.toLowerCase().includes(input.value.toLowerCase().trim());
      })
      if (showSearchRow && showfilteredRow) {
        tr.style.display = "";
        return tr;
      } else {
        tr.style.display = "none";
      }
    })
    // paginator({
    //   getRows: filteredTrs,
    //   box: document.getElementById("index_native"),
    // })
}
function moreTable(data) {
  var modal = document.getElementById("myModal");
  let moreTable = document.getElementById('moreTable');
  modal.style.display = "block";
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    moreTable.innerHTML = ''
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      moreTable.innerHTML = ''
    }
  }
  const { thead, tbody } = displayTable([data], false);
  moreTable.appendChild(thead);
  moreTable.appendChild(tbody);
}

function displayTable(movieData, isMovieTable = true) {
  let headers = Object.keys(...movieData);
  let thead = document.createElement('thead');
  let tbody = document.createElement('tbody');
  let tr = document.createElement('tr');
  for(i=0; i<headers.length; i++) { // create header
    let th = document.createElement('th');
    let textNode = document.createTextNode(headers[i].split(/(?=[A-Z])/).join(" "));
    th.appendChild(textNode);
   
    if (isMovieTable) {
      let input = document.createElement('input');
      let icon = document.createElement('i'); // sort icon
      th.setAttribute("id", i);
      th.appendChild(input);
      input.addEventListener("change", handleFilter);
      th.appendChild(icon);
    }
    tr.appendChild(th);
    if (isMovieTable) {
      th.addEventListener('click', sortHeader)
    }
  }

  thead.appendChild(tr);
  movieData.forEach(data => {
    let tr = document.createElement('tr');
    headers.forEach(header => {
      let td = document.createElement('td');
      let textNode = document.createTextNode(data[header]);
      td.appendChild(textNode);
      tr.appendChild(td);
    })
    let objData = Object.values(data).find(d => typeof d === 'object');
    if (objData) {
      let td = document.createElement('td', {
        dataObj: objData,
      });
      let textNode = document.createTextNode('More');
      td.appendChild(textNode);
      td.setAttribute("id", 'more')
      td.addEventListener('click', function() {
        moreTable(objData);
        return false;
      });
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  })
  return {
    thead,
    tbody,
  }
}
