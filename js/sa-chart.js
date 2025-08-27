  $(document).ready(function () {
    // Reference to your users node in Firebase
    const usersRef = db.ref("users");
    const ctx = document.getElementById("saChart").getContext("2d");
    ctx.height = '540px';
    var saChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [],
        datasets: [
        {
            label: "Voted",
            data: [],
            backgroundColor: "rgba(75, 192, 192, 0.7)"
        },
        {
            label: "Not Voted",
            data: [],
            backgroundColor: "rgba(255, 99, 132, 0.7)"
        }
        ]
    },
    options: {
        responsive: true,
    //   maintainAspectRatio: false,
        plugins: {
        legend: { position: "top" },
        title: {
            display: true,
            text: "Voted Status per Course"
        }
        },
        scales: {
        x: {
            stacked: false
        },
        y: {
            beginAtZero: true,
            ticks: { stepSize: 5 }
        }
        }
    }
    });


    function populateDataForDashboard(snapshot) {
        $('#notVotedList').empty();
        $('#votedList').empty();
        $('#adminList').empty();
      const data = snapshot.val();
      let courseData = {};
      let votedUsers = [];
      let notVotedUsers = [];
      let adminUsers = [];

      // Loop through users
      Object.values(data).forEach(user => {
        let course = user.course;
        let voted = user.voted;
        let admin = user.admin;
        let name = user.name;

        if (!courseData[course]) {
          courseData[course] = { trueCount: 0, falseCount: 0 };
        }

        if (voted === true) {
          courseData[course].trueCount++;
          votedUsers.push(name);
        } else {
            courseData[course].falseCount++;
            notVotedUsers.push(name);
        }

        if (admin === true) {
            adminUsers.push(name);
        }
      });

      $('#notVotedCount').text(notVotedUsers.length);
      $('#votedCount').text(votedUsers.length);
      $('#adminCount').text(adminUsers.length);

      $.each(notVotedUsers, function(key, value) {
        $('#notVotedList').append(`<div class="list-group-item py-1 px-2">${value}</div>`)
      });

      $.each(votedUsers, function(key, value) {
        $('#votedList').append(`<div class="list-group-item py-1 px-2">${value}</div>`)
      });

      $.each(adminUsers, function(key, value) {
        $('#adminList').append(`<div class="list-group-item py-1 px-2">${value}</div>`)
      });

        // Prepare data for Chart.js
        const labels = Object.keys(courseData);
        const votedTrue = labels.map(c => courseData[c].trueCount);
        const votedFalse = labels.map(c => courseData[c].falseCount);

        saChart.data.labels = labels;
        saChart.data.datasets[0].data = votedTrue;
        saChart.data.datasets[1].data = votedFalse;

        saChart.update(); // ✅ refresh chart with new data
    }

    usersRef.on("value", function(snapshot) {
        populateDataForDashboard(snapshot);
    });
  });