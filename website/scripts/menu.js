document.addEventListener("DOMContentLoaded", function() {

    let home_button = document.getElementById("home-menu");
    let selected_button = document.getElementById("selected-menu");
    let personal_button = document.getElementById("personal-menu");
    //let groups_button = document.getElementById("groups-menu");
    let slider = document.getElementById("menu-slider");
    let searchBar = document.getElementById("search-bar");
    let searchContent = document.getElementById("search-content");
    let cleanText = document.getElementById("erase-text");
    let menu = document.getElementById("menu");
    let searchIcon = document.getElementById("search-icon");
    let backArrow = document.getElementById("back-arrow");
    let baseHeader = document.getElementById("base-header");
    let soloGroupMenu = document.getElementById("solo-group-switch");
    //let soloGroupSlider = document.getElementById("solo-group-slider");
    //let soloOption = document.getElementById("solo");
    //let groupOption = document.getElementById("group");
    //let createGroup = document.getElementById("create-group");
    let backArrowGroup = document.getElementById("back-arrow-groups");
    let backArrowGroupCards = document.getElementById("back-arrow-group-cards");
    let addGroupPage = document.getElementById("new-group-addition");
    //let addGroupCard = document.getElementById("create-new-group");
    //let header = document.getElementById("header");
    //let alpha = 0.8;
    let currentlyChosen = document.getElementById("currently-chosen");
    let dropDown = document.getElementById("drop-down-menu");
    let groupsDropDown = document.getElementsByClassName("drop-down-group");
    let groupsAddOrJoin = document.getElementById("groups-add-or-join");
    let selected = document.getElementById("drop-down-selected-option");
    let soloGroupModeChoice = document.getElementById("solo-group-mode-choice");
    let dropDownCreateNewGroup = document.getElementById("drop-down-create-new-group");
    let tinderCards = document.getElementById("processed-data");
    let groupCards = document.getElementById("processed-group-cards");
    let addNewMemberButton = document.getElementById("add-member-to-group");
    let tinderButtons = document.querySelector(".tinder--buttons");
    let tinderGroupButtons = document.querySelector(".tinder--buttons-groups");
    let switchSwipeRec = document.getElementById("switch-cards-rec");
    let swipeMode = document.getElementById("swipe-cards");
    let recMode = document.getElementById("recommendations");
    let swipeDefault = "solo";
    let recDefault = "norec";
    let switchCursor = document.getElementById("switch-cursor");
    


    // Page contents
    let topText = document.getElementById("top-text");
    let searchHeader = document.getElementById("search-header");
    let homePageContent = document.getElementById("home-page");
    let selectedPageContent = document.getElementById("selected-page");
    let cardsPage = document.getElementById("personal-cards");
    let groupsPage = document.getElementById("group-options");
    let groupsCardsPage = document.getElementById("group-cards");
    let topPicksPage = document.getElementById("top-picks");

    // Menu animations for slider
    home_button.addEventListener("click", function() {
        slider.className = "";
        slider.classList.add("menu-slider-first");
        //soloGroupSlider.classList.remove("solo-group-slider-move");
        menu.classList.remove("menu-transition");
        //fadeOutBackground();


        // Switch contents
        topText.textContent = "Add restaurants you've been to";
        baseHeader.classList.remove("base-header-transition");
        baseHeader.classList.remove("base-header-transition-groups");
        //soloGroupMenu.classList.remove("solo-group-switch-transition");
        homePageContent.style.display = "block";
        searchHeader.style.display = "block";
        selectedPageContent.style.display = "none";
        cardsPage.style.display = "none";
        switchSwipeRec.style.display = "none";
        //groupsPage.style.display = "none";
        groupsCardsPage.style.display = "none";
        soloGroupModeChoice.style.display = "none";
        baseHeader.querySelector("p").style.display = "block";
        soloGroupModeChoice.style.display = "none";
        addNewMemberButton.style.display = "none";
    });

    selected_button.addEventListener("click", function() {
        slider.className = "";
        slider.classList.add("menu-slider-second");
        //soloGroupSlider.classList.remove("solo-group-slider-move");
        menu.classList.remove("menu-transition");
        //fadeInBackground();

        // Switch contents
        topText.textContent = "Rate restaurants you've been to";
        baseHeader.classList.remove("base-header-transition");
        baseHeader.classList.remove("base-header-transition-groups");
        //soloGroupMenu.classList.remove("solo-group-switch-transition");
        homePageContent.style.display = "none";
        searchHeader.style.display = "none";
        selectedPageContent.style.display = "block";
        cardsPage.style.display = "none"
        switchSwipeRec.style.display = "none";
        //groupsPage.style.display = "none";
        groupsCardsPage.style.display = "none";
        soloGroupModeChoice.style.display = "none";
        baseHeader.querySelector("p").style.display = "block";
        addNewMemberButton.style.display = "none";
    });

    personal_button.addEventListener("click", function() {
        slider.className = "";
        slider.classList.add("menu-slider-third");
        //soloGroupSlider.classList.remove("solo-group-slider-move");
        menu.classList.remove("menu-transition");
        //fadeInBackground();

        // Switch contents
        //topText.textContent = "Swipe right if you like, left if you don't";
        baseHeader.classList.add("base-header-transition");
        baseHeader.classList.remove("base-header-transition-groups");
        //soloGroupMenu.classList.add("solo-group-switch-transition");
        homePageContent.style.display = "none";
        searchHeader.style.display = "none";
        selectedPageContent.style.display = "none";
        if (recDefault != "recs") {
            if (swipeDefault == "solo") {
                cardsPage.style.display = "block";
                groupsCardsPage.style.display = "none";
            } else {
                cardsPage.style.display = "none";
                groupsCardsPage.style.display = "block";
            }
        }
        soloGroupModeChoice.style.display = "block";
        baseHeader.querySelector("p").style.display = "none";
        switchSwipeRec.style.display = "block";

        // Add or remove "Add member" option
        let p_option = currentlyChosen.querySelector("p").getAttribute("id");
        if (p_option != "solo") {
            addNewMemberButton.style.display = "block";
        } else {
            addNewMemberButton.style.display = "none";
        }

        // Switch between swipe and rec
        swipeMode.addEventListener("click", function (){
            topPicksPage.style.display = "none";
            cardsPage.style.display = "none";
            switchCursor.classList.remove("rec-switch-transition");
            recDefault = "norec"
            if (swipeDefault == "solo") {
                fetchSoloCards();
                cardsPage.style.display = "block";
                groupsCardsPage.style.display = "none";
            } else {
                fetchGroupCards(getCookie("group_id"));
                cardsPage.style.display = "none";
                groupsCardsPage.style.display = "block";
                groupCards.style.display = "block";
                tinderGroupButtons.style.display = "block";
            }

        });

        recMode.addEventListener("click", get_recs);
    });

    function get_recs(){
        if (!currentlyChosen.classList.contains("currently-chosen-clicked")){
            switchCursor.classList.add("rec-switch-transition");
            cardsPage.style.display = "none";
            groupsCardsPage.style.display = "none";
            topPicksPage.style.display = "block";
            recDefault = "recs";
        }

        if (swipeDefault == "solo"){
            var data = {
                "user_id" : getCookie("user_id")
            };

            // Load cards
            fetch('http://127.0.0.1:5000/solo_recs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.text())
            .then(html => {
                // Update the HTML of a div with the processed data
                document.getElementById("top-picks").innerHTML = html;
            });
        } else {
            var data = {
                "group_id" : getCookie("group_id")
            };
            // Load cards
            fetch('http://127.0.0.1:5000/group_recs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.text())
            .then(html => {
                // Update the HTML of a div with the processed data
                document.getElementById("top-picks").innerHTML = html;
            });
        }

        
    }

    // Top menu groups animations
    //soloOption.addEventListener("click", function() {
    //    soloGroupSlider.classList.remove("solo-group-slider-move");
    //    baseHeader.classList.add("base-header-transition");
    //    baseHeader.classList.remove("base-header-transition-groups");
    //    cardsPage.style.display = "block";
    //    groupsPage.style.display = "none";
    //    menu.classList.remove("menu-transition");
    //    createGroup.classList.remove("create-group-transition");
    //});
    // Define a function to update the child elements
    // Get an array of the child elements
    

    currentlyChosen.addEventListener("click", showDropDown);
    
    function showDropDown(){
        if (currentlyChosen.classList.contains("currently-chosen-clicked")){
            // Remove children
            for (let i = 0; i < groupsDropDown.length; i++) {
                const child = groupsDropDown[i];
                child.classList.remove("drop-down-group-display");
            }
            selected.style.display = "none"
            

            // Close when called
            currentlyChosen.classList.remove("currently-chosen-clicked");
            groupsAddOrJoin.classList.remove("drop-down-group-display");
            chevronClose.className = "fa-solid fa-chevron-down";
            //Change icon colours
            let main_img = currentlyChosen.querySelector("img");
            main_img.src = "images/single_user.png";

            soloGroupModeChoice.style.backgroundColor = "transparent";
            baseHeader.style.height = "50px";
            menu.style.display = "block";
            baseHeader.classList.add("base-header-transition");
            baseHeader.classList.remove("base-header-transition-groups");
            //tinderCards.style.display = "block";

            setTimeout(function(){
            switchSwipeRec.style.display = "block";
            }, 700);
            
            // Add or remove "Add member" option
            let p_option = currentlyChosen.querySelector("p").getAttribute("id");
            if (p_option != "solo") {
                addNewMemberButton.style.display = "block";
                if (recDefault != "recs") {
                    groupCards.style.display = "block";
                    tinderGroupButtons.style.display = "block";
                } else {
                    topPicksPage.style.display = "block";
                }
                
            } else {
                addNewMemberButton.style.display = "none";
                if (recDefault != "recs") {
                    tinderCards.style.display = "block";
                    tinderButtons.style.display = "block";
                } else {
                    topPicksPage.style.display = "block";
                }
            }

            

        } else {
            baseHeader.style.height = "80px";
            baseHeader.classList.remove("base-header-transition");
            baseHeader.classList.remove("base-header-transition-groups");
            addNewMemberButton.style.display = "none";
            groupCards.style.display = "none";
            tinderCards.style.display = "none";
            tinderGroupButtons.style.display = "none";
            tinderButtons.style.display = "none";
            switchSwipeRec.style.display = "none";
            topPicksPage.style.display = "none";

            setTimeout(function(){
                menu.style.display = "none";
                currentlyChosen.classList.add("currently-chosen-clicked");
                //soloGroupModeChoice.style.backgroundColor = "white";
                //Change icon colours
                //let main_img = currentlyChosen.querySelector("img");
                //main_img.src = "images/single_user_red.png";
                tinderCards.style.display = "none";
            }, 500);
            


            setTimeout(function() {
                groupsAddOrJoin.classList.add("drop-down-group-display");
            
                //Inverse arrow
                const icon = currentlyChosen.querySelector('i');
                icon.className = "fa-solid fa-chevron-up"

                const childElements = Array.from(groupsDropDown);

                // Add groups one by one
                function updateChildren(index) {
                    // Check if there are any more child elements to update
                    if (index >= childElements.length) {
                        return;
                    }
                
                    // Update the current child element
                    const currentChild = childElements[index];
                    currentChild.classList.add("drop-down-group-display")

                    currentChild.addEventListener("mouseover", function(){
                        if (currentChild.querySelector("h3").textContent == "Solo"){
                            img_to_change = currentChild.querySelector("img");
                            img_to_change.src = "images/single_user.png";
                        } else {
                            img_to_change = currentChild.querySelector("img");
                            img_to_change.src = "images/users.png";
                        }
                        
                    })

                    currentChild.addEventListener("mouseout", function(){
                        if (currentChild.querySelector("h3").textContent == "Solo"){
                            img_to_change = currentChild.querySelector("img");
                            img_to_change.src = "images/single_user_red.png";
                        } else {
                            img_to_change = currentChild.querySelector("img");
                            img_to_change.src = "images/users_red.png";
                        }
                    })

                    currentChild.addEventListener("click", function(){
                        let p = currentlyChosen.querySelector("p")

                        if (index == 0){
                            selected.style.top = "67px";
                            p.textContent = "Solo";
                            p.setAttribute("id", "solo")
                            swipeDefault = "solo";
                            fetchSoloCards();
                            get_recs();

                        } else {
                            let top = 67 + 65 + (index-1)*71
                            selected.style.top = top + "px";
                            p.textContent = currentChild.querySelector("h3").textContent;
                            let group_id = currentChild.querySelector("h3").getAttribute("id");
                            setCookie("group_id", group_id, 365);
                            p.setAttribute("id", group_id)
                            swipeDefault = "group";
                            fetchGroupCards(group_id);
                            get_recs();
                        }

                        // TODO : Actions to change the rest of the content of the page
                    })
                
                    // Wait for 1 second before updating the next child element
                    setTimeout(function() {
                        updateChildren(index + 1);
                    }, 50);
                }

                // Start updating the child elements
                updateChildren(0);

                selected.style.display = "block"

            }, 500);
        }

    }

    function fetchSoloCards(){
        cardsPage.style.display = "block";
        groupsCardsPage.style.display = "none";
    }

    function fetchGroupCards(group_id){
        // Prepare data

        var data = {
            "user_id" : getCookie("user_id"),
            "group_id" : group_id
        };

        //setCookie("group_id", group_id, 365);
        // Load cards
        fetch('http://127.0.0.1:5000/group_cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(html => {
            // Update the HTML of a div with the processed data
            document.getElementById("processed-group-cards").innerHTML = html;
        });

        // Change display
        //groupPage.style.display = "none";
        cardsPage.style.display = "none";
        groupsCardsPage.style.display = "block";
        //soloGroupMenu.classList.remove("solo-group-switch-transition");
    }

    //groupOption.addEventListener("click", groupActivate);
    backArrowGroup.addEventListener("click", groupActivate);
    //backArrowGroupCards.addEventListener("click", groupActivate);

    function groupActivate() {
        if (!backArrowGroup.classList.contains("only-adding-member")){
            baseHeader.classList.remove("base-header-transition");
            baseHeader.classList.remove("base-header-transition-groups");
            
            setTimeout(function(){
                addGroupPage.style.display = "none";
                groupsCardsPage.style.display = "none";
                soloGroupModeChoice.style.display = "block";
                baseHeader.querySelector("p").style.display = "none";
                showDropDown();
            }, 500)
            
        } else{
            addGroupPage.style.display = "none";
            groupsCardsPage.style.display = "block";
            soloGroupModeChoice.style.display = "block";
            baseHeader.querySelector("p").style.display = "none";
            backArrowGroup.classList.remove("only-adding-member");
            addNewMemberButton.style.display = "block";
            switchSwipeRec.style.display = "block";
        }
    }

    dropDownCreateNewGroup.addEventListener("click", addNewGroupFct);
    addNewMemberButton.addEventListener("click", addNewMemberFct);

    function addNewGroupFct(){
        currentlyChosen.classList.remove("currently-chosen-clicked");
        topText.textContent = "Invite friends to join";
        baseHeader.classList.remove("base-header-transition-groups");
        baseHeader.classList.add("base-header-transition");
        //soloGroupMenu.classList.remove("solo-group-switch-transition");
        soloGroupModeChoice.style.display = "none";
        baseHeader.querySelector("p").style.display = "block";

        // Switch content
        //groupsPage.style.display = "none";
        addGroupPage.style.display = "block";
        addNewMemberButton.style.display = "none"
        groupsCardsPage.style.display = "none";
        tinderCards.style.display = "none";
        topPicksPage.style.display = "none";
        switchSwipeRec.style.display = "none";
    }

    function addNewMemberFct(){
        backArrowGroup.classList.add("only-adding-member");
        currentlyChosen.classList.remove("currently-chosen-clicked");
        topText.textContent = "Invite friends to join";
        //baseHeader.classList.remove("base-header-transition-groups");
        //baseHeader.classList.add("base-header-transition");
        //soloGroupMenu.classList.remove("solo-group-switch-transition");
        soloGroupModeChoice.style.display = "none";
        baseHeader.querySelector("p").style.display = "block";

        // Switch content
        //groupsPage.style.display = "none";
        addGroupPage.style.display = "block";
        addNewMemberButton.style.display = "none"
        groupsCardsPage.style.display = "none";
        tinderCards.style.display = "none";
        topPicksPage.style.display = "none";
        switchSwipeRec.style.display = "none";
    }

    // Search bar animations
    searchBar.addEventListener("keyup", function() {
        let searchValue = this.value;

        if (searchValue.length > 0) {
            searchContent.style.display = "block";
            cleanText.style.display = "block";
            menu.style.display = "none";
            searchIcon.style.display = "none";
            backArrow.style.display = "block";
        }
        
    });

    searchBar.addEventListener('keydown', function(event) {
        let searchValue = this.value;
        if (event.code === 'Backspace' || event.code === 'Delete') {
          if (searchValue.length == 1) {
            searchContent.style.display = "none";
            cleanText.style.display = "none";
            menu.style.display = "block"
            searchIcon.style.display = "block";
            backArrow.style.display = "none";
          }
        }
    });

    cleanText.addEventListener("click", function(){
        searchBar.value = "";
    });

    backArrow.addEventListener("click", function(){
        searchContent.style.display = "none";
        cleanText.style.display = "none";
        menu.style.display = "block"
        searchIcon.style.display = "block";
        backArrow.style.display = "none";
        searchBar.value = "";
    });


    // TO BE REMOVED AS THIS IS DUPLICATE
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }

});