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

    <li class="nav-item for-admin" id="votes-menu">
        <a class="nav-link" href="votes.html">
            <i class="fas fa-fw fa-table"></i>
            <span>Votes</span></a>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider for-admin">

    <!-- Heading -->
    <li class="nav-item for-admin" id="not-voted-yet-menu">
        <a class="nav-link" href="not-voted-manage.html">
            <i class="fas fa-fw fa-table"></i>
            <span>Not Voted</span></a>
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

    <li class="nav-item for-admin" id="result-menu">
        <a class="nav-link" href="result.html">
            <i class="fas fa-fw fa-chart-area"></i>
            <span class="result-text">Partial Result</span></a>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider d-none d-md-block">

    <!-- Sidebar Toggler (Sidebar) -->
    <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>            
`);

$('#page-top').addClass('sidebar-toggled');
$('#accordionSidebar').addClass('toggled');

$(document).ready(function() {
    populateSidebar = function(page) {
        $(`#${page}-menu`).addClass('active');
    }
});