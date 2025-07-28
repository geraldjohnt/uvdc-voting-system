$('#accordionSidebar').append(`
    

    <!-- Sidebar - Brand -->
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
        <div class="sidebar-brand-icon rotate-n-15">
            <i class="fas fa-laugh-wink"></i>
        </div>
        <div class="sidebar-brand-text mx-3">UVDC Voting</div>
    </a>

    <!-- Divider -->
    <hr class="sidebar-divider my-0">

    <!-- Nav Item - Dashboard -->
    <li class="nav-item" id="dashboard-menu">
        <a class="nav-link" href="index.html">
            <i class="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span></a>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider for-admin">

    <!-- Heading -->
    <div class="sidebar-heading for-admin">
        Management
    </div>

    <li class="nav-item for-admin" id="voters-menu">
        <a class="nav-link" href="users-manage.html">
            <i class="fas fa-fw fa-table"></i>
            <span>Voters</span></a>
    </li>

    <li class="nav-item for-admin" id="admins-menu">
        <a class="nav-link" href="admin-manage.html">
            <i class="fas fa-fw fa-table"></i>
            <span>Admins</span></a>
    </li>

    <!-- Nav Item - Pages Collapse Menu -->
    <li class="nav-item" id="not-voted-yet-menu">
        <a class="nav-link" href="#" data-toggle="collapse" data-target="#collapseCourse" aria-expanded="true"
            aria-controls="collapseCourse">
            <i class="fas fa-fw fa-cog"></i>
            <span>Not voted yet</span>
        </a>
        <div id="collapseCourse" class="collapse" aria-labelledby="headingTwo"
            data-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded" id="not-yet-voted">
                <h6 class="collapse-header">Courses:</h6>
            </div>
        </div>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider for-admin">

    <!-- Heading -->
    <div class="sidebar-heading for-admin">
        Results
    </div>

    <li class="nav-item for-admin" id="votes-collected-menu">
        <a class="nav-link" href="votes-collected.html">
            <i class="fas fa-fw fa-chart-area"></i>
            <span>Votes Collected</span></a>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider d-none d-md-block">

    <!-- Sidebar Toggler (Sidebar) -->
    <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>            
`);

db.ref('users').once('value').then(function(snapshot) {
  const users = snapshot.val();
  const coursesSet = new Set();

  for (let id in users) {
    const user = users[id];
    if (user.course) {
      coursesSet.add(user.course);
    }
  }

  // Convert Set to Array (optional)
  const uniqueCourses = Array.from(coursesSet).sort();

  $.each(uniqueCourses, function(key, value) {
    $('#not-yet-voted').append(`
        <a class="collapse-item" href="not-voted-manage.html?course=${value}" id="${value}-course">${value}</a>
    `);
  });
  console.log("Unique Courses:", uniqueCourses);
});

$(document).ready(function() {
    populateSidebar = function(page) {
        $(`#${page}-menu`).addClass('active');

        if (page == 'not-voted-yet') {
            const params = new URLSearchParams(window.location.search);
            const course = params.get("course");

            $('#collapseCourse').addClass('show');
            
            if (course) {
                $(`#${course}-course`).addClass('active');
                // Do something like filter table rows, etc.
            }
        }
    }
});