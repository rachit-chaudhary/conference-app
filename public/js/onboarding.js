(function () {
    "use strict";

    const form = document.querySelector(".onboarding-form");

    if (!form) {
        return;
    }

    const groups = {
        interests: {
            selector: "[data-selection-group='interests']",
            itemSelector: ".interest-chip",
            input: document.getElementById("selectedInterests")
        },
        goals: {
            selector: "[data-selection-group='goals']",
            itemSelector: ".goal-card",
            input: document.getElementById("selectedGoals")
        }
    };

    function getSelectedValues(group) {
        return Array.from(document.querySelectorAll(`${group.itemSelector}.is-selected`))
            .map((item) => item.dataset.value);
    }

    function updateGroup(groupName) {
        const group = groups[groupName];
        const groupElement = document.querySelector(group.selector);
        const selectedValues = getSelectedValues(group);

        group.input.value = selectedValues.join(",");
        groupElement.classList.toggle("is-invalid", form.classList.contains("was-validated") && selectedValues.length === 0);

        return selectedValues.length > 0;
    }

    function validateForm() {
        const hasInterests = updateGroup("interests");
        const hasGoals = updateGroup("goals");

        return hasInterests && hasGoals;
    }

    Object.keys(groups).forEach((groupName) => {
        document.querySelectorAll(groups[groupName].itemSelector).forEach((item) => {
            item.addEventListener("click", () => {
                const isSelected = item.classList.toggle("is-selected");
                item.setAttribute("aria-pressed", isSelected ? "true" : "false");
                updateGroup(groupName);
            });

            item.setAttribute("aria-pressed", "false");
        });
    });

    form.addEventListener("submit", (event) => {
        form.classList.add("was-validated");

        if (!validateForm()) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
})();
