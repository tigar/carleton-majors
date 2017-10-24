function onBackButton() {
    if ($("#myBarChart").is(":visible")){
        $("#myBarChart").toggle(false);
        $("#results_table").toggle(true);
    }

    else if ($("#results_table").is(":visible")){
        $("#results_table").toggle(false);
        $("#button1").toggle(true);
        $("#button2").toggle(true);
        $("#button3").toggle(true);
        $("#backButton").toggle(false);
    }

    else if($("#tb_results_table").is(":visible")){
        $("#tb_results_table").toggle(false);
        $("#button1").toggle(true);
        $("#button2").toggle(true);
        $("#button3").toggle(true);
        $("#backButton").toggle(false);
    }

    else if($("#doucheChart").is(":visible")){
        $("#doucheChart").toggle(false);
        $("#button1").toggle(true);
        $("#button2").toggle(true);
        $("#button3").toggle(true);
        $("#backButton").toggle(false);
    }

}

function onHomeButton() {
    $("#results_table").toggle(false);
    $("#tb_results_table").toggle(false);
    $("#button1").toggle(true);
    $("#button2").toggle(true);
    $("#button3").toggle(true);
    $("#doucheChart").toggle(false);
    $("#myBarChart").toggle(false);
    $("#backButton").toggle(false);
}


function onMajorsButton() {
	$("#myBarChart").toggle(false);
	$("#backButton").toggle(true);

    var url = 'api/v1.0/majors/';
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('get', url);

    xmlHttpRequest.onreadystatechange = function() {
            if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                majorsCallback(xmlHttpRequest.responseText);
            }
        };

    xmlHttpRequest.send(null);
}



function majorsCallback(responseText) {
    $("#button1").toggle(false);
    $("#button2").toggle(false);
    $("#button3").toggle(false);
	$("#results_table").toggle(true);
	$("#myBarChart").toggle(false);
	$("#doucheChart").toggle(false);
	$("#tb_results_table").toggle(false);
	$("#backButton").toggle(true);


    var majorsList = JSON.parse(responseText);
    var tableBody = '';
    tableBody += '<tr>'
                        + '<th>Major</th>'
                        + '<th>Major ID</th>'
                        + '</tr>';
    for (var k = 0; k < majorsList.length; k++) {
		tableBody += '<tr>';
        tableBody += '<td><a onclick="getMajor(' + majorsList[k]['major_id'] + ",'"
                            + majorsList[k]['major_name'] + "')\">"
                            + majorsList[k]['major_name'] + '</a></td>';

        tableBody += '<td>' + majorsList[k]['major_id'] + '</td>';
        tableBody += '</tr>';
    }


    var resultsTableElement = document.getElementById('results_table');
    resultsTableElement.innerHTML = tableBody;
}

function getMajor(majorID, majorName) {
    var url = 'api/v1.0/years/' + majorID;
	xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('get', url);

    xmlHttpRequest.onreadystatechange = function() {
            if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                getYearsForMajorCallback(majorName, xmlHttpRequest.responseText);
            }
        };

    xmlHttpRequest.send(null);
}

function getYearsForMajorCallback(majorName, responseText) {
    $("#button1").toggle(false);
    $("#button2").toggle(false);
    $("#button3").toggle(false);
    $("#results_table").toggle(false);
    $("#doucheChart").toggle(false);
    $("#tb_results_table").toggle(false);
    $("#backButton").toggle(true);
    $("#myBarChart").replaceWith('<canvas id="myBarChart"></canvas>');

	var JSONdata = JSON.parse(responseText);

	var labelArray = new Array([]);
	var datasetOneArray = new Array([]);
	var datasetTwoArray = new Array([]);
	var datasetThreeArray = new Array([]);


	for (var k = 0; k < JSONdata.length; k++) {
		labelArray.push(JSONdata[k]['year']);
		datasetOneArray.push(JSONdata[k]['male_count']);
		datasetTwoArray.push(JSONdata[k]['female_count']);
		datasetThreeArray.push(JSONdata[k]['female_count']
								+ JSONdata[k]['male_count']);
		
    }

	var data = {
        labels: labelArray,
        datasets: [{
                label: "Males",
                backgroundColor: "#43439F",
                data: datasetOneArray
                }, {
                label: "Females",
                backgroundColor: "#06064B",
                data: datasetTwoArray
                }, {
                label: "Total",
                backgroundColor: "#D4C31C",
                data: datasetThreeArray
                }]
        };



    var ctx = $("#myBarChart").get(0).getContext("2d");
    var myBarChart = 
        new Chart(ctx, {
			type: 'bar',
            data: data,
            options : {
                scales: {
    				yAxes: [{
    		    	scaleLabel: {
    		        display: true,
    		        labelString: 'Majors'
    		      	}
    		    	}],
    		    	xAxes: [{
    		    	scaleLabel: {
    		        display: true,
    		        labelString: 'Years'
    		      	}
    		    	}]
			}
		}

});

    $("#myBarChart").toggle(true);
}



function onTopBottomButton() {
    $("#button1").toggle(false);
    $("#button2").toggle(false);
    $("#button3").toggle(false);
    $("#results_table").toggle(false);
    $("#myBarChart").toggle(false);
    $("#doucheChart").toggle(false);
    $("#tb_results_table").toggle(false);
    $("#backButton").toggle(true);


    var url = 'api/v1.0/years/';
    xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('get', url);

    xmlHttpRequest.onreadystatechange = function() {
            if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                topBottomCallback(xmlHttpRequest.responseText);
            }
        };

    xmlHttpRequest.send(null);
}

function topBottomCallback(responseText) {
	$("#button1").toggle(false);
    $("#button2").toggle(false);
    $("#button3").toggle(false);
    $("#results_table").toggle(false);
    $("#myBarChart").toggle(false);
    $("#doucheChart").toggle(false);
    $("#tb_results_table").toggle(false);
    $("#backButton").toggle(true);

	var JSONdata = JSON.parse(responseText);

	var yearArray = new Array();

    for (var year = 2001; year < 2016; year ++){
        var resultsDict = {'year': year};
        var length = 1;
        var previousBottomTies = 0;
        var previousTopTies = 0;
        var bottomTie = new Array();
        var topTie = new Array();

        for (var k = 0; k < JSONdata.length; k++) {
            if (JSONdata[k]['year'] == year) {
                var majorTotal = JSONdata[k]['female_count']
                                 + JSONdata[k]['male_count'];

                if (length == 1){
                    resultsDict['top_major_name'] = JSONdata[k]['major_name'];
                    resultsDict['top_major_count'] = majorTotal;

                    if (majorTotal != 0) {
                        resultsDict['bottom_major_name'] = JSONdata[k]['major_name'];
                        resultsDict['bottom_major_count'] = majorTotal;
                    }
                    else {
                        resultsDict['bottom_major_name'] = "Placeholder";
                        resultsDict['bottom_major_count'] = 60;
                    }

                    length ++;
                }

                else if (resultsDict['top_major_count'] < majorTotal) {
                    resultsDict['top_major_name'] = JSONdata[k]['major_name'];
                    resultsDict['top_major_count'] = majorTotal;
                }

                else if (resultsDict['top_major_count'] == majorTotal) {
                    if (previousTopTies == 0) {
                        topTie.push(resultsDict['top_major_name']);
                        topTie.push(JSONdata[k]['major_name']);
                    }

                    else {
                        topTie.push(JSONdata[k]['major_name']);
                    }

                    resultsDict['top_major_name'] = topTie;
                    previousTopTies ++;
                }

                else if ((typeof(resultsDict['bottom_major_name']) == typeof(""))
                            && resultsDict['bottom_major_count'] > majorTotal
                            && majorTotal != 0) {
                    resultsDict['bottom_major_name'] = JSONdata[k]['major_name'];
                    resultsDict['bottom_major_count'] = majorTotal;
                }

                else if (typeof(resultsDict['bottom_major_name']) != typeof("")) {
                    if (resultsDict['bottom_major_count'] > majorTotal
                           && majorTotal != 0){
                          resultsDict['bottom_major_name'] = JSONdata[k]['major_name'];
                          resultsDict['bottom_major_count'] = majorTotal;
                    }
                }

                else if (resultsDict['bottom_major_count'] == majorTotal) {
                    if (previousBottomTies == 0) {
                        bottomTie.push(resultsDict['bottom_major_name']);
                        bottomTie.push(JSONdata[k]['major_name']);
                        previousBottomTies ++;
                    }

                    else {
                        bottomTie.push(JSONdata[k]['major_name']);
                    }

                    resultsDict['bottom_major_name'] = bottomTie;
                }

            }
        }
        yearArray.push(resultsDict);
    }
    makeTableforTopBottom(yearArray);
}

function makeTableforTopBottom(yearArray) {
    $("#button1").toggle(false);
    $("#button2").toggle(false);
    $("#button3").toggle(false);
    $("#results_table").toggle(false);
    $("#myBarChart").toggle(false);
    $("#doucheChart").toggle(false);
    $("#tb_results_table").toggle(true);
    $("#backButton").toggle(true);

    var tableBody = '';
    tableBody += '<tr>'
                        + '<th>Year</th>'
                        + '<th>Bottom Major</th>'
                        + '<th>Majors</th>'
                        + '<th>Top Major</th>'
                        + '<th>Majors</th>'
                        + '</tr>';

    for (var k = 0; k < yearArray.length; k++) {
        tableBody += '<tr>';

        if (typeof(yearArray[k]['bottom_major_name']) == typeof("")
             && typeof(yearArray[k]['top_major_name']) == typeof("")){
            tableBody += '<td>' + yearArray[k]['year'] + '</td>';
            tableBody += '<td>' + yearArray[k]['bottom_major_name'] + '</td>';
            tableBody += '<td>' + yearArray[k]['bottom_major_count'] + '</td>';
            tableBody += '<td>' + yearArray[k]['top_major_name'] + '</td>';
            tableBody += '<td>' + yearArray[k]['top_major_count'] + '</td>'
        }

        else if (typeof(yearArray[k]['bottom_major_name']) != typeof("")){
            var first = 0;
            var bottomLength = yearArray[k]['bottom_major_name'].length;

            if (typeof(yearArray[k]['top_major_name']) != typeof("")) {
                var topLength = yearArray[k]['top_major_name'].length;
                var difference = bottomLength - topLength;

                if (difference > 0){
                    var counter = 0;
                    for (name in yearArray[k]['bottom_major_name']){
                        if (first == 0) {
                            tableBody += '<td>' + yearArray[k]['year'] +  '</td>';
                            first ++;
                        }

                        else {
                            tableBody += '<td> - </td>';
                        }
                        tableBody += '<td>' + yearArray[k]['bottom_major_name'][name] + '</td>';
                        tableBody += '<td>' + yearArray[k]['bottom_major_count'] + '</td>';
                    }

                    if (counter < topLength){
                        tableBody += '<td>' + yearArray[k]['top_major_name'][counter] + '</td>';
                        tableBody += '<td>' + yearArray[k]['top_major_count'] + '</td>';
                        tableBody += '</tr>';
                        counter ++
                    }

                    else {
                        tableBody += '<td> - </td>';
                        tableBody += '<td> - </td>';
                        tableBody += '</tr>';
                    }
                }

                else if (difference < 0) {
                    var counter = 0;
                    for (name in yearArray[k]['top_major_name']){

                        if (first == 0) {
                            tableBody += '<td>' + yearArray[k]['year'] + '</td>';
                            first ++;
                        }

                        else {
                            tableBody += '<td> - </td>';
                        }

                        if (counter < bottomLength){
                            tableBody += '<td>' + yearArray[k]['bottom_major_name'][counter] + '</td>';
                            tableBody += '<td>' + yearArray[k]['bottom_major_count'] + '</td>';
                            counter ++
                        }

                        else {
                            tableBody += '<td> - </td>';
                            tableBody += '<td> - </td>';
                        }

                        tableBody += '<td>' + yearArray[k]['top_major_name'][name] + '</td>';
                        tableBody += '<td>' + yearArray[k]['top_major_count'] + '</td>';
                        tableBody += '</tr>';
                    }
                }

                else {
                    for (name in yearArray[k]['bottom_major_name']){
                        if (first == 0) {
                            tableBody += '<td>' + yearArray[k]['year'] + '</td>';
                            first ++;
                        }

                        else {
                            tableBody += '<td> - </td>';
                        }

                        tableBody += '<td>' + yearArray[k]['bottom_major_name'][name] + '</td>';
                        tableBody += '<td>' + yearArray[k]['bottom_major_count'] + '</td>';
                        tableBody += '<td>' + yearArray[k]['top_major_name'][name] + '</td>';
                        tableBody += '<td>' + yearArray[k]['top_major_count'] + '</td>';
                        tableBody += '</tr>';
                    }
                }
            }

        else {
            for (name in yearArray[k]['bottom_major_name']){
                var length = yearArray[k]['bottom_major_name'].length;

                if (first == 0) {
                    tableBody += '<td>' + yearArray[k]['year'] + '</td>';
                }

                else {
                    tableBody += '<td> - </td>';
                }
                tableBody += '<td>' + yearArray[k]['bottom_major_name'][name] + '</td>';
                tableBody += '<td>' + yearArray[k]['bottom_major_count'] + '</td>';

                if (first == 0) {
                    tableBody += '<td>' + yearArray[k]['top_major_name'] + '</td>';
                    tableBody += '<td>' + yearArray[k]['top_major_count'] + '</td>';
                    tableBody += '</tr>';
                    first ++;
                }

                else {
                    tableBody += '<td> - </td>';
                    tableBody += '<td> - </td>';
                    tableBody += '</tr>';
                }
            }
        }
    }

    else {
        var topLength = yearArray[k]['top_major_name'].length;
        var first = 1;

        if (first == 0) {
            tableBody += '<td>' + yearArray[k]['year'] + '</td>';
            tableBody += '<td>' + yearArray[k]['bottom_major_name'] + '</td>';
            tableBody += '<td>' + yearArray[k]['bottom_major_count'] + '</td>';
            first ++;
        }

        else {
            tableBody += '<td> - </td>';
        }

        for (name in yearArray[k]['top_major_name']) {
            tableBody += '<td>' + yearArray[k]['top_major_name'][name] + '</td>';
            tableBody += '<td>' + yearArray[k]['top_major_count'] + '</td>';
            tableBody += '</tr>';
        }
    }
}

    var resultsTableElement = document.getElementById('tb_results_table');
    resultsTableElement.innerHTML = tableBody;
}

function onDouchinessButton() {
	var url = 'api/v1.0/years/';
	xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('get', url);

    xmlHttpRequest.onreadystatechange = function() {
            if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                calculateDouchiness(xmlHttpRequest.responseText);
            }
        };

    xmlHttpRequest.send(null);
}



function calculateDouchiness(responseText) {
	var JSONdata = JSON.parse(responseText);

	var labelArray = new Array();
	var datasetTotalArray = new Array();
	var doucheArray = new Array();

	var doucheDict = {};
	var curTotal = 0;
	var maxLevel = 0;

    for (var year = 2001; year < 2016; year ++){
        labelArray.push(year);
        var resultsDict = {'year': year};

        for (var k = 0; k < JSONdata.length; k++) {
            if (JSONdata[k]['year'] == year){
                var curMajorID = JSONdata[k]['major_id'];

                if (curMajorID == 15 || curMajorID == 17 || curMajorID == 36 || curMajorID == 38 || curMajorID == 39){
                    curTotal += JSONdata[k]['female_count'] + JSONdata[k]['male_count'];
                }
            }

        }
        resultsDict['total'] = curTotal;
        doucheArray.push(resultsDict);
        curTotal = 0;
    }


	for (var h = 0; h < doucheArray.length; h++){
		if (doucheArray[h]['total'] > maxLevel) {
			maxLevel = doucheArray[h]['total'];
		}
	}

	var scalar = 420/maxLevel;

	for (var j = 0; j < doucheArray.length; j++){
		doucheArray[j]['total'] = doucheArray[j]['total']*scalar;
		datasetTotalArray.push(doucheArray[j]['total']);
	}

	displayDouchiness(labelArray, datasetTotalArray);
}



function displayDouchiness(labelArray, completeArray) {
    $("#button1").toggle(false);
    $("#button2").toggle(false);
    $("#button3").toggle(false);
    $("#results_table").toggle(false);
    $("#myBarChart").toggle(false);
    $("#tb_results_table").toggle(false);
    $("#backButton").toggle(true);
    $("#myBarChart").replaceWith('<canvas id="myBarChart"></canvas>');


	var data = {
    labels: labelArray,
    datasets: [{
            label: "Total",
            backgroundColor: "#D4C31C",
            data: completeArray
            }]
    };



    var ctx = $("#myBarChart").get(0).getContext("2d");
    var myBarChart =
        new Chart(ctx, {
			type: 'bar',
            data: data,
            options : {
                scales: {
    				yAxes: [{
    		    	scaleLabel: {
    		        display: true,
    		        labelString: 'Douchiness'
    		      	}
    		    	}],
    		    	xAxes: [{
    		    	scaleLabel: {
    		        display: true,
    		        labelString: 'Years'
    		      	}
    		    	}]
				}
			}

	});

    $("#doucheChart").toggle(true);
}

