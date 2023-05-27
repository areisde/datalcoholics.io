document.addEventListener("DOMContentLoaded", function() {
    var moreStatsButton = document.getElementById("general_stats");

    moreStatsButton.addEventListener("click", function(){
        var generalStatsContainer = document.getElementById("general_stats_container");
        generalStatsContainer.style.display = "block";
    })
});