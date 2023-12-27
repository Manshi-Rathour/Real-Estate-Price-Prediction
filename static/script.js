function getBathValue() {
    var uiBath = document.getElementsByName("uiBath");
    for (var radio of uiBath) {
        if (radio.checked) {
            return parseInt(radio.value);
        }
    }
    return -1; // Invalid Value
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var radio of uiBHK) {
        if (radio.checked) {
            return parseInt(radio.value);
        }
    }
    return -1;
}

function onClickedEstimatedPrice() {
    console.log("Estimated price button clicked");
    
    // Get input values
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("uiEstimatedPrice");

    if (isNaN(parseFloat(sqft.value)) || bhk === -1 || bathrooms === -1) {
        console.error("Invalid input values");
        return;
    }
    

    var requestData = {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    };

    console.log("Request Payload:", requestData);

    $.ajax({
        type: "POST",
        url: "/predict_home_price",
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: function(data, status, xhr) {
            if (xhr.status === 200) {
                if ("estimated_price" in data) {
                    console.log(data.estimated_price);
                    estPrice.innerHTML = "<h2 style='color: black;'>" + data.estimated_price.toString() + " Lakh</h2>";
                } else {
                    console.error("Invalid response format: 'estimated_price' not found");
                }
            } else {
                console.error("Error in the AJAX request:", xhr.status, xhr.statusText);
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.error("Error in the AJAX request:", textStatus, errorThrown);
        }
    });
}




function onPageLoad() {
    console.log("document loaded");
    $.get("/get_location_names", function(data, status) {
        console.log("got response for get_location_names request:", data, status);
        if (data && data.locations) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            for (var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);

                // Print each location to the console
                // console.log("Location:", locations[i]);
            }
        } else {
            console.error("Invalid response format or missing locations field.");
        }
    })
    .fail(function(xhr, textStatus, errorThrown) {
        console.error("Error in the AJAX request:", textStatus, errorThrown);
    });
}


$(document).ready(onPageLoad);

