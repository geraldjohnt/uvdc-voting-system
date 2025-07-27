$(document).ready(function () {
    populateCards = function() {
        var candidateOrder = {
            'p': 'President', 
            'ivp': 'Internal Vice President', 
            'evp': 'External Vice President',
            's': 'Secretary',
            'as': 'Assistant Secretary',
            't': 'Treasurer',
            'at': 'Assistant Treasurer',
            'a': 'Auditor',
            'pio': 'PIO'
        };
        var candidateList = {
            p: [],
            ivp: [],
            evp: [],
            s: [],
            as: [],
            t: [],
            at: [],
            a: [],
            pio: []
        };
        
        db.ref("candidates").once("value").then(function(snapshot) {
            const data = snapshot.val();

            if(data) {
                var cardNumber = 1;
                const candidatesArray = Object.entries(data).map(([key, candidate]) => {
                    return { id: key, ...candidate };
                });
    
                // Sort alphabetically by name (ASC)
                candidatesArray.sort((a, b) => a.name.localeCompare(b.name));
    
                // Now use the sorted array
                candidatesArray.forEach(candidate => {
                    candidateList[candidate.position].push(candidate);
                });

                $.each(candidateOrder, function(key, value) {
                    var body = `<div class="row justify-content-center">
                        <div class="d-sm-flex align-items-center justify-content-between mb-4">
                            <h1 class="mb-0 text-gray-800">${value}</h1>
                        </div>
                    </div>
                    <div class="row justify-content-center">`;
                    $.each(candidateList[key], function(ckey, cvalue) {
                        body = body + `
                            <div class="col-12 col-md-6 mb-4">
                                <div class="card shadow h-100 p-2">
                                    <div class="card-body p-0">
                                        <div class="row no-gutters align-items-center">
                                            <div class="col-auto mr-2">
                                                <div class="row no-gutters align-items-center">
                                                    <div class="col">
                                                        <img id="c${cardNumber}-image" style="width: 100px"
                                                            src="img/candidates/unknown.png">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="mb-1"><h1><span id="c${cardNumber}-name">Loading...</span> (<u id="c${cardNumber}-party">Loading...</u>)</h1></div>
                                                <div class="progress mb-4">
                                                    <div class="progress-bar" id="c${cardNumber}-progress" role="progressbar" style="width: 0%"
                                                        aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                                <div class="mb-1"><h3><strong><span id="c${cardNumber}-votes">Loading...</span> votes</strong></h3></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        cardNumber++;
                    });
                    body = body + `</div>`;
                    $('#body-content').append(body);
                });

                populateResults();
            }
        });
    }

    populateResults = function() {
        db.ref("candidates").once("value").then(function(snapshot) {
            const candidates = snapshot.val();
    
            // Check if data is valid
            if (candidates) {
                const candidatesArray = Object.entries(candidates).map(([key, candidate]) => {
                    return { id: key, ...candidate };
                });
    
                // Sort alphabetically by name (ASC)
                candidatesArray.sort((a, b) => a.name.localeCompare(b.name));
                db.ref('votes').on('value', function(snapshot) {
                    var candidateList = {
                        p: [],
                        ivp: [],
                        evp: [],
                        s: [],
                        as: [],
                        t: [],
                        at: [],
                        a: [],
                        pio: []
                    };
        
                    // Now use the sorted array
                    candidatesArray.forEach(candidate => {
                        candidate.votes = 0;
                        candidateList[candidate.position].push(candidate);
                    });

                    const votes = snapshot.val();
        
                    for (let userId in votes) {
                        const positions = votes[userId];
                        
                        $.each(positions, function(position, canId) {
                            if (!candidateList[position].filter(a => a.id == canId)[0].votes) {
                                candidateList[position].filter(a => a.id == canId)[0].votes = 0;
                            }
                            candidateList[position].filter(a => a.id == canId)[0].votes++
                        });
                    }
                    $.each(candidateList, function(key, value) {
                        var totalVotesPerPosition = value.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);

                        const updated = value.map(candidate => {
                            const votes = candidate.votes || 0;
                            const percentage = totalVotesPerPosition > 0 ? (votes / totalVotesPerPosition * 100).toFixed(2) : "0.00";
                            return {
                                ...candidate,
                                percentage: percentage
                            };
                        });

                        candidateList[key] = updated.sort((a, b) => {
                            return parseFloat(b.percentage) - parseFloat(a.percentage);
                        });
                    });
                    
                    assignValuesToCards(candidateList);
                });
            }
        });
    }

    assignValuesToCards = function(candidateList) {
        var cardNumber = 1;
        $.each(candidateList, function(key, value) {
            $.each(value, function(ckey, cvalue) {
                $(`#c${cardNumber}-image`).attr('src', `img/candidates/c${cvalue.id}.png`)
                $(`#c${cardNumber}-name`).html(cvalue.name);
                $(`#c${cardNumber}-party`).html(cvalue.party);
                $(`#c${cardNumber}-votes`).html(cvalue.votes || 0);
                $(`#c${cardNumber}-progress`).css('width', `${cvalue.percentage}%`);
                $(`#c${cardNumber}-progress`).attr('aria-valuenow', `${cvalue.percentage}`);
                cardNumber++;
            });
        });
    }
});