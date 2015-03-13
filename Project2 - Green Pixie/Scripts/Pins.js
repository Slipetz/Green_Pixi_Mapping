
//Function Loads the Green P Data from the Server if we haven't already, or makes use of the previously downloaded/stored version
function LoadGreenPLots() {
    $("#WelcomeModal").modal("hide");
    if ($.trim($("#GreenPJSON").html()) === "") {
        $.get("/GreenP")
            .success(function (json) {
                $("#GreenPJSON").html(json);
                LoadGreenPPins(jQuery.parseJSON(json));
            })
            .fail(function () {
                alert("Call to GreenP Failed!");
            });
    } else {
        LoadGreenPPins(jQuery.parseJSON($("#GreenPJSON").html()));
    }
    $("#optionDropDown").val("GreenP");
}

//Function loads the Bixi Information from the Server on Demand - This information is prone to changing
function LoadBixieLots() {
    $("#WelcomeModal").modal("hide");
    $.get("/BixieBike")
        .success(function (json) {
            LoadBixiePins(jQuery.parseJSON(json));
        })
        .fail(function () {
            alert("Call to Bixie Bikes Failed!");
        });
    $("#optionDropDown").val("Bixi");
}

//Function Loads Both the GreenP and the Bixi Information from their respective functions
function LoadBothLots() {
    LoadGreenPLots();
    LoadBixieLots();
    $("#optionDropDown").val("Both");
}

//Takes the Bixi JSON string retrieved and parses it to place the Bixi pins on the map
function LoadBixiePins(data) {
    $.each(data.stationBeanList, function(index, value) {
        var pin = generatePinTemplate(value, "Bixie");
        pin.extras = value;
        Microsoft.Maps.Events.addHandler(pin, 'click', displayBixieModal);
        map.entities.push(pin);
    });
}

//Takes the Green P JSON string retrieved and parses it to place the Green P pins on the map
function LoadGreenPPins(data) {
    $.each(data.carparks, function(index, value) {
        var pin = generatePinTemplate({ latitude: value.lat, longitude: value.lng }, "GreenP");
        pin.extras = value;
        Microsoft.Maps.Events.addHandler(pin, 'click', displayGreenPModal);
        map.entities.push(pin);
    });
}

//Loads the Bixi Modal with the proper information from the Pin that was clicked on
function displayBixieModal(pin) {
    savedPin = pin.target;
    var stationInformation = pin.target.extras;
    $("#bixieStationID").text("Station ID: " + stationInformation.id);
    $("#bixieStationName").text("Station Name/Address: " + stationInformation.stationName);
    $("#bixieAvailableBikes").text(stationInformation.availableBikes);
    $("#bixieAvailableDocks").text(stationInformation.availableDocks);
    $("#bixieTotalDocks").text(stationInformation.totalDocks);

    $("#BixiLat").val(stationInformation.latitude);
    $("#BixiLong").val(stationInformation.longitude);

    $("#BixieModal").modal("show");
}

//Loads the GreenP modal with the proper information from the Pin that was clicked on
function displayGreenPModal(pin) {
    savedPin = pin.target;
    var lotInformation = pin.target.extras;
    $("#GreenPLotID").text("Lot ID: " + lotInformation.id);
    $("#GreenPLotAddress").text("Lot Address: " + lotInformation.address);
    $("#GreenPParkingType").text("Lot Type: " + lotInformation.carpark_type_str);
    $("#GreenPTTCLot").text("TTC Station? " + (lotInformation.is_ttc ? "Yes" : "No"));

    $("#GreenPPaymentOptions").empty();
    $("#GreenPPaymentMethods").empty();
    $("#GreenPRates").empty();
    $("#GreenPRatePerHalfHour").empty();

    $.each(lotInformation.payment_options, function (index, value) {
        $("#GreenPPaymentOptions").append("<tr><td>" + value + "</td></tr>");
    });
    $.each(lotInformation.payment_methods, function (index, value) {
        $("#GreenPPaymentMethods").append("<tr><td>" + value + "</td></tr>");
    });
    $.each(lotInformation.rate_details, function (index, value) {
        $("#GreenPRatePerHalfHour").append("<th colspan='2' class='text-center'><strong> Rate Per Half Hour: $" + lotInformation.rate_half_hour + "</strong></th>");
        GenerateRatesTable(value);
    });

    $("#GreenPLat").val(lotInformation.lat);
    $("#GreenPLong").val(lotInformation.lng);

    $("#GreenPModal").modal("show");
}

//Helper function to generate the Rates Tables from the Green P Json Data
function GenerateRatesTable(ratesDetails) {
    $.each(ratesDetails, function (innerIndex, innerValue) {
        $("#GreenPRates").append("<tr><td colspan='2' class='text-center'><strong>" + innerValue.title + "</strong></td></tr>");
        $.each(innerValue.rates, function (index, value) {
            $("#GreenPRates").append("<tr><td>" + value.when + "</td><td>" + value.rate + "</td></tr>");
        });
    });
}

//Helper function that generates a default pin template for the specific pin required
function generatePinTemplate(location, pinImg) {
    var pin = new Microsoft.Maps.Pushpin({ latitude: location.latitude, longitude: location.longitude }, {
        anchor: new Microsoft.Maps.Point(8, 8),
        icon: "/images/" + pinImg + ".png",
        width: 40,
        height: 40
    });
    return pin;
}

//Event Handler Function that responds to the dropdown list on the sidepanel
function DropdownChange() {
    clearMap();
    var newPins = $(this).val();
    if (newPins === "GreenP")
        LoadGreenPLots();
    else if (newPins === "Bixi")
        LoadBixieLots();
    else
        LoadBothLots();
}

//Helper function to clear the map of all of the pins
function clearMap() {
    for (var i = map.entities.getLength() - 1; i >= 0; i--) {
        var pushpin = map.entities.get(i);
        if (pushpin instanceof Microsoft.Maps.Pushpin)
            map.entities.removeAt(i);
    }
}

//Function to load the Food/Restaurant Modal based on the pin that was clicked
function displayFoodModal(pin) {
    var foodInformation = pin.target.extras;
    var hours = foodInformation.hours_display.split(";");
    $("#foodHours").empty();

    $("#foodName").text("Name: " + foodInformation.name);
    $("#foodAddress").text("Name: " + foodInformation.address);
    $("#foodTel").text("Name: " + foodInformation.tel);
    $.each(hours, function(index, value) {
        var tagBuilder = "<tr><td>" + value + "</td></tr>";
        $("#foodHours").append(tagBuilder);
    });
    $("#FoodModal").modal("show");
}