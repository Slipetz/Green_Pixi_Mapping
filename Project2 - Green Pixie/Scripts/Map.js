$(function () {
    GetMap();

    //Attaching Handler to the Dropdown List
    $("#optionDropDown").change(DropdownChange);

    //Setting the "Find Restaurants" Button Handler for the Bixi Modal
    $("#bixiRestaurants").click(function () {
        $("#BixieModal").modal("hide");
        clearMap();
        map.entities.push(savedPin);
        var latLong = { latitude: $("#BixiLat").val(), longitude: $("#BixiLong").val() };
        GetFactualData(latLong);
    });

    //Setting the "Find Restaurants" Button Handler for the GreenP Modal
    $("#greenPRestaurants").click(function () {
        $("#GreenPModal").modal("hide");
        clearMap();
        map.entities.push(savedPin);
        var latLong = { latitude: $("#GreenPLat").val(), longitude: $("#GreenPLong").val() };
        GetFactualData(latLong);
    });

    //Setting the Refrsh button to refresh the map with the seletec dropdown list item
    $("#refreshButton").click(function () {
        clearMap();
        var newPins = $("#optionDropDown").val();
        if (newPins === "GreenP")
            LoadGreenPLots();
        else if (newPins === "Bixi")
            LoadBixieLots();
        else
            LoadBothLots();
    });

});

var map;
var savedPin;

//Function to start the process of downloading/setting the Map tiles
function GetMap() {
    Microsoft.Maps.loadModule('Microsoft.Maps.Overlays.Style', { callback: loadMap });
}

//Callback function to load the map with the specific start-up/tile properties
function loadMap() {
    map = new Microsoft.Maps.Map(document.getElementById("BingMap"), {
        credentials: "Aqrt5YFDDjGW8yCAEA4wj1vI_Igde-69STndDl90rG5rel1wAORikL3NseswF-A_",
        customizeOverlays: true,
        enableClickableLogo: false,
        enableSearchLogo: false,
        showDashboard: true,
        showBreadcrumb: true,
        showCopyright: true,
        zoom: 14,
        labelOverlay: Microsoft.Maps.LabelOverlay.hidden
    });

    map.setView({ zoom: 14, center: new Microsoft.Maps.Location(43.6526, -79.371) });

    $("#WelcomeModal").modal("show");
}

//GET call to Factual to retrieve the restaurant/bar information based on the Pin location that was clicked
function GetFactualData(latLong) {

    $.get("http://api.v3.factual.com/t/places-ca", {
        filters: {"category_ids":{"$includes_any":[312,347]}},
        geo: { "$circle": { "$center": [latLong.latitude, latLong.longitude], "$meters": 1000 } },
        KEY: "tdyOQ7pUNeM1PkncC4pvZJfC2zx7e88t9hRVyuDC"
    }).success(function (data) {
        console.log(data);
        renderAllPins(data);
        loadSidePanel(data.response);
    }).error(function (data) {
        alert("Couldn't contact Factual. Please try again!");
    });
}

//Helper function to aid in the rendering of the Factual Data Pins
function renderAllPins(jsonData) {
    $.each(jsonData.response.data, function (index, value) {
        addPin(value);
    });
}

//Function that actually renders the Factual Data pins onto the map and sets their click event handler
function addPin(location) {

    var latLong = { latitude: location.latitude, longitude: location.longitude };

    var pin = new Microsoft.Maps.Pushpin(latLong, {
        icon: "/images/Food.png",
        anchor: new Microsoft.Maps.Point(8, 8),
        width: 40,
        height: 40
    });

    pin.extras = location;

    //// Add a handler for the pushpin click event.
    Microsoft.Maps.Events.addHandler(pin, 'click', displayFoodModal);

    // add the pin (push onto entities array)
    map.entities.push(pin);
}

//Helper function that loads the sidepanel with the information about the restaurants that were nearby the clicked GreenP/Bixi lot
function loadSidePanel(response) {
    $("#sidebarTitle").text("Restaurants/Bars");
    $("#sidebarList").empty();
    $.each(response.data, function(index, value) {
        var tagBuilder = "<li><div class='row'><div class='col-md-6'>";
        tagBuilder += "<h5>" + value.name + "</h5>";
        tagBuilder += "<h6>" + value.address + "</h6></div><div class='col-md-6'>";
        if(value.tel !== undefined)
            tagBuilder += "<h5>" + value.tel + "</h5>";
        tagBuilder += "<p>Distance: " + (value.$distance / 100).toFixed(2) + " km</p>";
        if(value.website !== undefined)
            tagBuilder += "<a target='_blank' href='" + value.website + "'>Website</a>";
        tagBuilder += "</div></div></li>";
        $("#sidebarList").append(tagBuilder);
    });
}