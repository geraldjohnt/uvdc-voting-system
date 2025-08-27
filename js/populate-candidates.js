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
                    var informationText = `
                        <div class="row">
                            <div class="col-12">
                                <p style="text-align: center;">Select your candidate, listed alphabetically by last name to ensure fairness.</p>
                            </div>
                        </div>
                    `;
                    $('#body-content').append(informationText);
                    $.each(candidateOrder, function(key, value) {
                        var body = '';
                        var rooster = `<div class="col-4 col-sm-3 col-lg-2 col-xl-1 mb-2 px-1">
                                <div class="card shadow h-100 rooster-card">
                                    <div class="card-body p-0">
                                        <div class="row no-gutters mb-1">
                                            <div class="col">
                                                <img style="width: 100%;" class="rooster-image" id="rooster-${key}"
                                                                    src="img/candidates/unknown.png">
                                            </div>
                                        </div>
                                        <div class="row no-gutters">
                                            <div class="col px-1">
                                                <p style="text-align: center;" class="m-0 rooster-name" id="rooster-${key}-name"><span class="text-danger">No vote</span></p>
                                            </div>
                                        </div>
                                        <div class="row no-gutters">
                                            <div class="col px-1">
                                                <p style="text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" class="m-0"><i>${value}</i></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        $('#rooster-content').append(rooster);
                        if (!['pio1', 'pio2', 'pio3'].includes(key) || key == `pio${year}`) {
                            body = body + `<div class="row justify-content-center">
                                    <div class="d-sm-flex align-items-center justify-content-between mb-2">
                                        <h1 class="h3 mb-0 text-gray-800">${value}</h1>
                                    </div>
                                </div>
                                <div class="row justify-content-center">`
                            $.each(candidateList[key], function(ckey, cvalue) {
                                body = body + `<div class="col-4 col-md-4 col-lg-3 col-xl-2 mb-4 px-1">
                                        <div class="card shadow h-100 candidate-card ${key}" onclick="selectCandidate(this, '${key}', ${cvalue.id}, '${cvalue.name}')">
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
                        }
                    });
                } else {
                  console.log("No candidates found.");
                }
                $('#buttons-content').append(`
                            <div class="row justify-content-center mb-1" id="certifyVote" style="display: none;">
                                <div class="col-12 col-sm-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="certify" value="1">
                                        <label class="form-check-label" for="certify">I, ${fullName}, hereby certify that my vote is authentic and valid.</label>
                                    </div>
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="col-6 col-sm-4" id="backButton" style="display: none;">
                                    <a class="btn btn-sm btn-danger btn-icon-split" onclick="hideRooster()" style="display: block;">
                                        <span class="text">Back</span>
                                    </a>
                                </div>
                                <div class="col-6 col-sm-4" id="clearButton">
                                    <a class="btn btn-sm btn-danger btn-icon-split disabled" id="clearVote" onclick="clearVote()" style="display: block;">
                                        <span class="text">Clear</span>
                                    </a>
                                </div>
                                <div class="col-6 col-sm-4" id="nextButton">
                                    <a class="btn btn-sm btn-primary btn-icon-split" onclick="viewRooster()" style="display: block;">
                                        <span class="text">Next</span>
                                    </a>
                                </div>
                                <div class="col-6 col-sm-4" id="submitButton" style="display: none;">
                                    <a class="btn btn-sm btn-success btn-icon-split disabled" id="submitVote" onclick="submitVote()" style="display: block;">
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

      selectCandidate = function(card, position, canId, name) {
          $(`.${position}`).removeClass('border-success');
          $(card).addClass('border-success');
          $(`#rooster-${position}`).attr('src', `img/candidates/c${canId}.png`);
          $(`#rooster-${position}-name`).html(`<span class="text-success"><strong>${name.split(", ")[0]}</strong></span>`);
          votes[position] = canId;
          console.log(votes);
          $('#clearVote').removeClass('disabled');
      }

      viewRooster = function() {
        $('#rooster-content').show();
        $('#body-content').hide();
        $('#backButton').show();
        $('#nextButton').hide();
        $('#clearButton').hide();
        $('#certifyVote').show();
        $('#submitButton').show();
        $('#certify').prop('checked', false);
        $('#submitVote').addClass('disabled');

        $("#certify").change(function () {
            if ($(this).is(":checked")) {
                // Code when checked
                $('#submitVote').removeClass('disabled');
            } else {
                // Code when unchecked
                $('#submitVote').addClass('disabled');
            }
        });
     }

      hideRooster = function() {
        $('#rooster-content').hide();
        $('#body-content').show();
        $('#backButton').hide();
        $('#nextButton').show();
        $('#clearButton').show();
        $('#certifyVote').hide();
        $('#submitButton').hide();
      }

      clearVote = function() {
        $('.candidate-card').removeClass('border-success');
        $(`.rooster-image`).attr('src', `img/candidates/unknown.png`);
        $(`.rooster-name`).html(`<span class="text-danger">No vote</span>`);
        $('#clearVote').addClass('disabled');
        votes = [];
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