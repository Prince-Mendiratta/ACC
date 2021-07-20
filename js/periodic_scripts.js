const main = document.querySelector('main');
const categories = ['metal', 'metalloid', 'nonmetal', 'noble', 'alkali', 'alkaline', 'transition', 'lanthanide', 'actinide'];
let activeElement = null;

loadElements().then(outputElements);

// Load the elements of the periodic table
// JSON data is provided by the Periodic Table JSON GitHub Repo
// https://github.com/Bowserinator/Periodic-Table-JSON
function loadElements() {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    let url = 'https://tyrandus.github.io/static/periodic-table/data.json';
    req.open('GET', url);
    req.onload = function () {
      console.log(JSON.parse(req.response));
      resolve(JSON.parse(req.response).elements);
    };
    req.send();
  });
}

// Output one <abbr> per element
function outputElements(elements) {
  let abbreviations = [];

  elements.forEach(elem => {
    let abbr = document.createElement('abbr');
    abbr.textContent = elem.symbol;
    abbr.style.gridColumn = elem.xpos;
    abbr.style.gridRow = elem.ypos;

    abbr.classList.add(elem.category.
    split(/[ ,]/).
    filter(c => {
      let ind = categories.indexOf(c);
      return ind >= 0;
    })[0]);

    abbr.addEventListener('click', () => {
      if (activeElement) activeElement.classList.remove('focus');
      abbr.classList.add('focus');
      activeElement = abbr;
      showInfo(elem);
    });
    main.appendChild(abbr);
    abbreviations.push(abbr);
  });

  let i = Math.floor(Math.random() * abbreviations.length);
  abbreviations[i].click();
}

const elName = document.getElementById('name');
const elSummary = document.getElementById('summary');
const elDiscoveredBy = document.getElementById('discovered-by');
const elNameGivenBy = document.getElementById('name-given-by');
const elAtomicMass = document.getElementById('atomic-mass');
const elDensity = document.getElementById('density');

// Show detailed information regarding one element
function showInfo(element) {
  elName.textContent = element.number + ' ' + element.name;
  elName.href = element.source;

  elSummary.textContent = element.summary;
  elDiscoveredBy.textContent = u(element.discovered_by);
  elNameGivenBy.textContent = u(element.named_by);
  elAtomicMass.textContent = u(element.atomic_mass) + ' u';
  elDensity.textContent = u(element.density) + ' g/L';

  // Replace null by "Unknown"
  function u(s) {
    return s ? s : 'Unknown';
  }
}