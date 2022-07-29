

let wells = false;
let chartData, labelData, datasets, indexCurve, indexType;

function drawChart(index){
    document.querySelector(".well").innerHTML += `

    <div class='chart'>

        <canvas id="Chart" width="500" height="400"></canvas>

    <\div>`;
    let Canvas = document.getElementById("Chart");
    let ctx = Canvas.getContext("2d");
    let speedData = {
      labels : labelData,
      datasets : [datasets[index]]
    };


    let chartOptions = {
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 70,
          fontColor: 'black',

        }
      },
      scales : {
        y : {
            title : {
                display : true


            },
            ticks : {
                reverse : true,
                autoSkip : false,
                minRotation : 90,
                maxRotation : 90

            }
        },
        x : {
            title : {
                display : true,
                text : `${indexType}`


            },
            ticks : {
                reverse : true,
                autoSkip : false,
                minRotation : 90,
                maxRotation : 90

            }
        }
      },
      //rotation : Math.PI * 0.5
    };

    let lineChart = new Chart(ctx, {
      type: 'line',
      data: speedData,
      options: chartOptions
    });

}

function createChart(well_i, wellbore_i, log_i){


    let logData = wells[well_i].wellbores[wellbore_i].logs[log_i].logData;
    let mnemonicList = logData.mnemonicList.split(",");
    indexCurve = mnemonicList.indexOf(wells[well_i].wellbores[wellbore_i].logs[log_i].indexCurve);
    let unitList = logData.unitList.split(",");
    let data = logData.data;
    let indexType = wells[well_i].wellbores[wellbore_i].logs[log_i].indexType;


    chartData = [];

    for(let i = 0; i < data.length; i++){
        let parsed = data[i].split(",");
        for(let j = 0; j < parsed.length; j++){
            if(i === 0){
                chartData.push([parseFloat(parsed[j])])
            }
            else{
                chartData[j].push(parseFloat(parsed[j]))
            }
        }
    }
    console.log(chartData);
    console.log(indexType);
    datasets = [];
    labelData;

    for(let i = 0; i < chartData.length; i++){
        if(i === indexCurve){
            labelData = chartData[i];
        }
        else{
            datasets.push({
                label : `${mnemonicList[i]} (${unitList[i]})`,
                data : chartData[i],
                lineTension: 0,
                fill: false,
                borderColor: 'red'
            })
        }
    }


let graphics = datasets.map((dataset, i) => `<div class='menu4-item' onclick = 'drawChart(${i})'>${dataset.label}</div>`).join("\n");
    console.log(`#menu1-item-${well_i}>.menu2-items>#menu2-item-${wellbore_i}>.menu3-items>#menu3-item-${log_i}`);
document.querySelector(`#menu1-item-${well_i}>.menu2-items>#menu2-item-${wellbore_i}>.menu3-items>#menu3-item-${log_i}`).innerHTML += graphics;

}

function show_wells() {
    if (document.querySelector('.menu1-items').classList.contains("open")){
        document.querySelector('.menu1-items').classList.remove("open")
        document.querySelector('#chevron').src = static + "icons/right-chevron.png";
    } else {
        document.querySelector('.menu1-items').classList.add("open")
        document.querySelector('#chevron').src = static + "icons/down-chevron.png";
    }
}

function show_wellbores(i) {
    if (document.querySelector(`#menu1-item-${i}>.menu2-items`).classList.contains("open")){
        document.querySelector(`#menu1-item-${i}>.menu2-items`).classList.remove("open")
        document.querySelector('#chevron').src = static + "icons/right-chevron.png";
    } else {
        document.querySelector(`#menu1-item-${i}>.menu2-items`).classList.add("open")
        document.querySelector('#chevron').src = static + "icons/down-chevron.png";
    }
    well_info(i)
}

function show_logs(i, j) {
    if (document.querySelector(`#menu2-item-${j}>.menu3-items`).classList.contains("open")){
        document.querySelector(`#menu2-item-${j}>.menu3-items`).classList.remove("open")
    } else {
        document.querySelector(`#menu2-item-${j}>.menu3-items`).classList.add("open")
        document.querySelector('#chevron').src = static + "icons/down-chevron.png";
    }
    wellbore_info(i, j)
}

function show_graphics(i, j) {
    if (document.querySelector(`#menu3-item-${j}>.menu4-items`).classList.contains("open")){
        document.querySelector(`#menu3-item-${j}>.menu4-items`).classList.remove("open")
    } else {
        document.querySelector(`#menu3-item-${j}>.menu4-items`).classList.add("open")
    }
    wellbore_info(i, j)
}

//function removeData(chart) {
    //chart.data.labels.pop();
    //chart.data.datasets.forEach((dataset) => {
      //  dataset.data.pop();
   // });
    //chart.update();
//}

function log_info(wellbore_index, index){
    let log = wellbores[wellbore_index].logs[index];
    let html = `
    <div class = 'log_info' >
        <h2> ${log.name} </h2>
        <p> ${log.attr.uid}</p>
    </div>`
    document.querySelector('.well').innerHTML = html;
}

function wellbore_info(well_index, index){
    let wellbore = wells[well_index].wellbores[index];
    let html = `
    <div class = 'wellbore_info' width = 200px>
        <h2> Название скважины: ${wellbore.name} </h2>
        <p> ID скважины: ${wellbore.attr.uid}</p>
    </div>`
    document.querySelector('.well').innerHTML = html;
}

function well_info(index){
    let well = wells[index]
    let html = `
    <div class = 'well_info' >

         <h2> Название месторождения: ${well.name} </h2>
         <p> ID месторождения: ${well.attr.uid}</p>
         <p> Страна: ${(well.country)?well.country:"Неизвестно"}</p>

    </div>`
    document.querySelector('.well').innerHTML = html;
}

let button = document.querySelector("#run");
button.onclick = async function(event){

    event.preventDefault();
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

   let login = document.querySelector("#login").value;
   let password = document.querySelector("#password").value;
   let url = document.querySelector("#url").value;

    //let login = "navigator";
    //let password = "Qwe123!!!";
   // let url = "http://10.23.125.144/Witsml.Web/api/soap";
    console.log(login, password, url);
    let body = {login,password,url};
    let response = await fetch('get_info/',{
        method:"POST",
        headers:{'X-CSRFToken':csrftoken},
        body:JSON.stringify(body)})
    let json = await response.json();
    wells = json;
    console.log(json);






    if (json){
        //---------Перебор well--------------------------
        let wells = json.map((well,i) => {
            if(well.wellbores.length > 0){
                //-----------------перебор wellbores-------------------
                let wellbores = well.wellbores.map((wellbore, j) => {
                    if(wellbore.logs.length > 0){
                        let logs = wellbore.logs.map((log, n) => {
                            return `
                            <div  class = 'menu3-item' id = 'menu3-item-${n}' >
                               <p onclick = 'createChart(${i}, ${j}, ${n})' dblclick = 'removeData(${i})'> ${log.name} </p>
                            </div>`
                        }).join("\n");
                        return `
                        <div  class = 'menu2-item' id='menu2-item-${j}' >
                            <p onclick='show_logs(${i},${j})'>
                            <img src='${static}icons/right-chevron.png' id='chevron' class="chevron"/> ${wellbore.name}</p>
                            <div class='menu3-items'>
                                 ${logs}
                            </div>
                        </div>`
                    }
                    return `
                    <div  class = 'menu2-item' onclick = 'wellbore_info(${i},${j})' >
                        ${wellbore.name}
                    </div>`
                    }).join("\n");
                return `
                <div  class = 'menu1-item' id='menu1-item-${i}'>
                    <p onclick='show_wellbores(${i})'>
                    <img src='${static}icons/right-chevron.png' id='chevron' class="chevron" /> ${well.name}</p>
                    <div class='menu2-items'>
                        ${wellbores}
                    </div>
                </div>`
                //-----------------перебор wellbores закончен------------------------
                }
                return `
                <div  class = 'menu1-item' id='menu1-item-${i}' onclick = 'well_info(${i})' >
                    <p> ${well.name}</p>
                </div>`
        }).join("\n");
        //--------------перебор wells закончился
        document.querySelector("main").innerHTML = `
        <nav>
        <div class = 'menu1' >
            <p onclick = 'show_wells()'>
                <img src='${static}icons/right-chevron.png' id='chevron' class="chevron"/>
                Месторождения
            </p>
            <div  class = 'menu1-items' >

            ${wells}
            </div>
        </div>

        </nav>
        <section class = 'well' >



        </section>`;

    }




}

