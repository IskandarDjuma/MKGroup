// const headers = document.querySelectorAll('.tab__header');

// headers.forEach(header => {
//   header.addEventListener('click', () => {
//     header.classList.toggle('active');
//   })
// });

// //

// const tabs = document.querySelectorAll('.tab__header-item');
// const tabsContent = document.querySelectorAll('.tab__content');
// const tabsParent = document.querySelector('.tab__header-items');

// function hideTabContent () {
//   tabsContent.forEach(item => {
//     item.style.display = 'none';
//   });

//   tabs.forEach(item => {
//     item.classList.remove('tab__header-item--active')
//   });
// }

// function showTabContent(i) {
//   tabsContent[i].style.display = 'block';
//   tabs[i].classList.add('tab__header-item--active');
// };



// tabsParent.addEventListener('click', (evt) => {
//   const target = evt.target;

//   if (target && target.classList.contains('tab__header-item')) {
//     tabs.forEach((item, i) => {
//       if (target == item) {
//         hideTabContent();
//         showTabContent(i);
//       }
//     });
//   }
// });


const adaptTabs = document.querySelectorAll(".adaptive-tabs");
const linkEl = "adaptive-tabs__link";
const contentEl = "adaptive-tabs__tab-content";

function populateTabs(tabComponent) {
    let tabNav = document.createElement("nav");
    tabNav.setAttribute("class", "adaptive-tabs__nav");
    let items = tabComponent.querySelectorAll("." + linkEl);
    for (let item of items) {
        let tabItem = item.cloneNode(true);
        tabNav.appendChild(tabItem);
    }
    let firstContent = tabComponent.firstChild;
    tabComponent.insertBefore(tabNav, firstContent);
}

function stateChange() {
    // Use data-threshold to determine when to change display states.
    for (let group of adaptTabs) {
        function mediaWidth(x) {
            let status;
            if (x.matches) {
                group.classList.remove("adaptive-tabs--tabbed");
                group.classList.add("adaptive-tabs--accordion");
            } else {
                group.classList.remove("adaptive-tabs--accordion");
                group.classList.add("adaptive-tabs--tabbed");
            }
        }
        let threshold = group.getAttribute("data-threshold");
        let x = window.matchMedia("(max-width: " + threshold + "px)");
        mediaWidth(x);
        x.addListener(mediaWidth);
    }
}

function showAndHide() {

    let inactiveContent = contentEl + "--inactive";
    let inactiveHeading = linkEl + "--inactive";

    // Go through each instance of the component
    for (let group of adaptTabs) {

        // Function to produce the tabbed navigation
        populateTabs(group);

        let innerWrap = group.querySelector(".adaptive-tabs__content");
        let nav = group.querySelector(".adaptive-tabs__nav");
        let links = group.querySelectorAll("." + linkEl);
        let headings = innerWrap.querySelectorAll("." + linkEl);
        let tabs = nav.querySelectorAll("." + linkEl);
        let drawers = innerWrap.querySelectorAll("." + contentEl);

        for (let i = 0; i < links.length; i++) {

            let link = links[i];

            // Expose/activate the first items
            for (let h = 1; h < headings.length; h++) {
                tabs[h].classList.add(inactiveHeading);
                headings[h].classList.add(inactiveHeading);
                drawers[h].classList.add(inactiveContent);
            }

            link.addEventListener("click", function (e) {
                e.preventDefault();

                let target = this.getAttribute("data-target"),
                    selectedLinks = group.querySelectorAll("[data-target=\"" + target + "\"]"),
                    selectedText = group.querySelector(target);

					links.forEach( link => link.classList.add(inactiveHeading));
					drawers.forEach( drawer => drawer.classList.add(inactiveContent));
					selectedLinks.forEach( selected => selected.classList.remove(inactiveHeading));

                selectedText.classList.remove(inactiveContent);
            });
        }
    }

    // Listen for width threshold
    stateChange();
}

// Basic show/hide functionality
showAndHide();
