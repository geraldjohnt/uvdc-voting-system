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
                        var body = '';
                        var rooster = `<div class="col-4 col-sm-3 col-lg-2 col-xl-1 mb-2">
                                <div class="card shadow h-100 rooster-card">
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
                        body = body + `<div class="row justify-content-center">
                                <div class="d-sm-flex align-items-center justify-content-between mb-2">
                                    <h1 class="h3 mb-0 text-gray-800">${value}</h1>
                                </div>
                            </div>
                            <div class="row justify-content-center">`
                        $.each(candidateList[key], function(ckey, cvalue) {
                            body = body + `<div class="col-4 col-md-4 col-lg-3 col-xl-2 mb-4 px-1">
                                    <div class="card shadow h-100 candidate-card ${key}" onclick="selectCandidate(this, '${key}', ${cvalue.id})">
                                        <div class="card-body p-1">
                                            <div class="row no-gutters align-items-center mb-1">
                                                <div class="col">
                                                    <img style="width: 100%;"
                                                        src="img/candidates/c${cvalue.id}.png">
                                                </div>
                                            </div>
                                            <div class="row no-gutters">
                                                <div class="col align-items-center">
                                                    <p style="width: fit-content; text-align: center;" class="mx-auto m-0">${cvalue.name}</p>
                                                </div>
                                            </div>
                                            <div class="row no-gutters">
                                                <div class="col align-items-center">
                                                    <p style="width: fit-content; text-align: center;" class="mx-auto m-0"><u>${cvalue.party}</u></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                        });
                        body = body + `</div>`
                        $('#body-content').append(body);
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

      selectCandidate = function(card, position, canId) {
          $(`.${position}`).removeClass('border-success');
          $(card).addClass('border-success');
          $(`#rooster-${position}`).attr('src', `img/candidates/c${canId}.png`);
          votes[position] = canId;
          console.log(votes);
      }

      viewRooster = function() {
        $('#rooster-content').show();
        $('#body-content').hide();
        $('#backButton').show();
        $('#nextButton').hide();
        $('#submitButton').show();
     }

      hideRooster = function() {
        $('#rooster-content').hide();
        $('#body-content').show();
        $('#backButton').hide();
        $('#nextButton').show();
        $('#submitButton').hide();
      }

      submitVote = function() {
        db.ref('votes/'+idNumber).set(votes).then(() => {
            db.ref('users/'+idNumber).update({"voted": true}).then(() => {
                $('#rooster-content').hide();
                $('#buttons-content').hide();
                $('#warning-content').show();
                console.log("Saved Successfully");
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
        })
        .catch((error) => {
            console.log("Error: ", error);
        });
      }
});