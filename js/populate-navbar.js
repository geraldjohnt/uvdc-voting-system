$('#navbar-ui').append(`
    <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
        <i class="fa fa-bars"></i>
    </button>

    <!-- Topbar Navbar -->
    <ul class="navbar-nav ml-auto" style="width: 69%">
        <li class="nav-item d-none d-xl-block no-arrow mr-auto">
            <h1 class="navbar-text m-0">UV SSC Officers Election</h1>
        </li>
        <li class="nav-item dropdown no-arrow">
            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="mr-2 d-lg-inline text-gray-600 small" id="timer"></span>
            </a>
        </li>

        <div class="topbar-divider d-none d-sm-block"></div>

        <!-- Nav Item - User Information -->
        <li class="nav-item dropdown no-arrow">
            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="mr-2 d-lg-inline text-gray-600 small" style="width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" id="fullName"></span>
                <img class="img-profile rounded-circle"
                    src="img/undraw_profile.svg">
            </a>
            <!-- Dropdown - User Information -->
            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="userDropdown">
                <a class="dropdown-item" href="#" data-toggle="modal" onclick="logout()">
                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Logout
                </a>
            </div>
        </li>

    </ul>
`)
$(document).ready(function() {
    // Set voting date and time
    var votingDate = "";
    var votingEnd = "";
    var now = new Date();
    
    var start = "";
    var end = "";

    var $timer = $("#timer");

    db.ref("votingDate").once("value")
    .then(function(snapshot) {
        votingDate = snapshot.val();

        db.ref("votingEnd").once("value")
        .then(function(snapshot) {
            votingEnd = snapshot.val();
            now = new Date();
            
            start = new Date(votingDate);
            end = new Date(votingEnd);
    
            if (now < start) {
                // Countdown before voting starts
                const diff = start - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
                $('#body-content').hide();
                $('#buttons-content').hide();
                $('#warning-message').html(`Voting hasn't started yet. Please come back in </br><span class="text-primary">${hours}h ${minutes}m ${seconds}s</span>`);
                $('#warning-content').show();
    
                $timer.html(`Voting starts in:<br /> <span class="text-primary">${hours}h ${minutes}m ${seconds}s</span>`);
            } else if (now >= start && now <= end) {
                // Show how long voting has been active
                const diff = now - start;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
                $timer.html(`Voting started:<br /> <span class="text-success">${hours}h ${minutes}m ${seconds}s ago</span>`);
                
                $('#body-content').show();
                $('#buttons-content').show();
                $('#warning-content').hide();
            } else {
                // Voting has ended
                $('#body-content').hide();
                $('#buttons-content').hide();
                $('#warning-message').html(`Voting has ended.`);
                $('#warning-content').show();
                $timer.html(`<span class="text-danger">Voting has ended.</span>`);
            }
        });
    });

    function updateVotingTimer() {
        now = new Date();

        if (now < start) {
            // Countdown before voting starts
            const diff = start - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            $('#body-content').hide();
            $('#buttons-content').hide();
            $('#warning-message').html(`Voting hasn't started yet. Please come back in </br><span class="text-primary">${hours}h ${minutes}m ${seconds}s</span>`);
            $('#warning-content').show();

            $timer.html(`Voting starts in:<br /> <span class="text-primary">${hours}h ${minutes}m ${seconds}s</span>`);
        } else if (now >= start && now <= end) {
            // Show how long voting has been active
            const diff = now - start;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            $timer.html(`Voting started:<br /> <span class="text-success">${hours}h ${minutes}m ${seconds}s ago</span>`);
            $('.result-text').text('Partial Result');
        } else {
            // Voting has ended
            $timer.html(`<span class="text-danger">Voting has ended.</span>`);
            $('.result-text').text('Final Result');
        }
    }

    // Start the timer and update every second
    setInterval(updateVotingTimer, 1000);
    updateVotingTimer();
});