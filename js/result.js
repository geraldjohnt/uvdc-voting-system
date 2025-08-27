$(document).ready(function () {
    var generalCandidateList = {};
    populateResult = function(sa = false) {
        var candidateOrder = {};
        var candidateList = {};
        var roosterContainer = sa ? 'sa-rooster-content' : 'rooster-content';
        var roosterClasses = sa ? 'col-1' : 'col-4 col-sm-4 col-lg-2 mb-2';

        db.ref("positions").once("value", function(snapshot) {
            var positions = snapshot.val();

            // Sort by positionOrder
            positions.sort(function(a, b) {
                return a.positionOrder - b.positionOrder;
            });

            // Build candidateOrder and candidateList dynamically
            var candidateOrder = {};
            var candidateList = {};

            positions.forEach(function(pos) {
                candidateOrder[pos.positionAcronym] = pos.positionName;
                candidateList[pos.positionAcronym] = []; // empty array for candidates
                generalCandidateList[pos.positionAcronym] = []; // empty array for candidates
            });

            // console.log("candidateOrder:", candidateOrder);
            // console.log("candidateList:", candidateList);
            $.each(candidateOrder, function(key, value) {
                var rooster = `<div class="${roosterClasses} px-1" style="justify-content: center; display: flex;">
                        <div class="card shadow h-100 rooster-card mb-2"">
                            <div class="card-body p-0">
                                <div class="row no-gutters mb-1">
                                    <div class="col">
                                        <img style="width: 100%;" id="rooster-${key}-image"
                                                            src="img/candidates/unknown.png">
                                    </div>
                                </div>
                                <div class="row no-gutters">
                                    <div class="col px-1">
                                        <p style="text-align: center;" class="m-0" id="rooster-${key}-name"><span class="text-warning"><i>Tie</i></span></p>
                                    </div>
                                </div>
                                <div class="row no-gutters">
                                    <div class="col px-1">
                                        <p style="text-align: center;" class="m-0">${value}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                $(`#${roosterContainer}`).append(rooster);
            });

            getCandidates();
        });

    }

    getCandidates = function() {
        db.ref("candidates").once("value")
        .then(function(snapshot) {
            const candidates = snapshot.val();

            // Check if data is valid
            if (candidates) {
                const candidatesArray = Object.entries(candidates).map(([key, candidate]) => {
                    return { id: key, ...candidate };
                });

                // Sort alphabetically by name (ASC)
                candidatesArray.sort((a, b) => a.name.localeCompare(b.name));
                // console.log('Candidates Array: ', candidatesArray)
                db.ref('votes').on('value', function(snapshot) {
                    var candidateList = JSON.parse(JSON.stringify(generalCandidateList));
        
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

                    console.log('Candidate List: ', candidateList);
                    
                    getHighest(candidateList);
                });
            } else {
                console.log("No candidates found.");
            }
        })
        .catch(function(error) {
            console.error("Error fetching candidates:", error);
        });
    }

    function getHighest(candidatesByPosition) {
        // Loop through each position (p, ivp, evp, etc.)
        for (let position in candidatesByPosition) {
            let candidates = candidatesByPosition[position];

            // Find max percentage
            let maxPercentage = Math.max(...candidates.map(c => parseFloat(c.percentage)));

            // Get all candidates with that max percentage
            let topCandidates = candidates.filter(c => parseFloat(c.percentage) === maxPercentage);

            if (topCandidates.length > 1) {
                $(`#rooster-${position}-image`).attr('src', `img/candidates/unknown.png`)
                $(`#rooster-${position}-name`).html(`<span class="text-warning"><i>Tie</i></span>`)
            } else {
                $(`#rooster-${position}-image`).attr('src', `img/candidates/c${topCandidates[0].id}.png`)
                $(`#rooster-${position}-name`).html(`<span class="text-success"><strong>${topCandidates[0].name}</strong></span>`)
            }
        }

        console.log("General: ", generalCandidateList);
    }
});