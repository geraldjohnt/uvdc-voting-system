$(document).ready(function () {
    populateCandidates = function() {
        var candidateOrder = {};
        var candidateList = {};

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
            });

            console.log("candidateOrder:", candidateOrder);
            console.log("candidateList:", candidateList);

            db.ref("candidates").once("value")
              .then(function(snapshot) {
                const data = snapshot.val();
        
                // Check if data is valid
                if (data) {
                    const candidatesArray = Object.entries(data).map(([key, candidate]) => {
                        return { id: key, ...candidate };
                    });
        
                    // Sort alphabetically by name (ASC)
                    candidatesArray.sort((a, b) => a.name.localeCompare(b.name));
        
                    // Now use the sorted array
                    candidatesArray.forEach(candidate => {
                        candidateList[candidate.position].push(candidate);
                    });
                    console.log(candidateList);
                    // console.log(candidateOrder);
                    $.each(candidateOrder, function(key, value) {
                        var rooster = `<div class="col-4 col-sm-4 col-lg-2 mb-2" style="justify-content: center; display: flex;">
                                <div class="card shadow h-100 rooster-card mb-2" style="width: 80%;">
                                    <div class="card-body p-0">
                                        <div class="row no-gutters mb-1">
                                            <div class="col">
                                                <img style="width: 100%;" id="rooster-${key}"
                                                                    src="img/candidates/unknown.png">
                                            </div>
                                        </div>
                                        <div class="row no-gutters">
                                            <div class="col px-1">
                                                <p>${value}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        $('#rooster-content').append(rooster);
                    });
                } else {
                  console.log("No candidates found.");
                }
                $('#buttons-content').append(`
                            <div class="row justify-content-center">
                                <div class="col-12 col-sm-4" id="backButton" style="display: none;">
                                    <a class="btn btn-danger btn-icon-split btn-lg" onclick="hideRooster()" style="display: block;">
                                        <span class="text">Back</span>
                                    </a>
                                </div>
                                <div class="col-12 col-sm-4" id="nextButton">
                                    <a class="btn btn-primary btn-icon-split btn-lg" onclick="viewRooster()" style="display: block;">
                                        <span class="text">Next</span>
                                    </a>
                                </div>
                                <div class="col-12 col-sm-4" id="submitButton" style="display: none;">
                                    <a class="btn btn-primary btn-icon-split btn-lg" onclick="submitVote()" style="display: block;">
                                        <span class="text">Submit</span>
                                    </a>
                                </div>
                            </div>
                    `);
              })
              .catch(function(error) {
                console.error("Error fetching candidates:", error);
              });
        });

    }
});