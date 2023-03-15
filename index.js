document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("username-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("The form was submitted");
    const username = document.getElementById("username-input").value;
    const userSummary = await fetchUserSummary(username);
    updateUserSummary(userSummary);
  });

  // Call github API to retrieve information
  const fetchUserSummary = (username) => {
    const apiEndpoint = "https://api.github.com/users/" + username;

    if (!username) {
      return null;
    }
    return fetch(apiEndpoint)
      .then((response) => {
        if (response.status != 200) {
          throw new Error("No record found with username " + username);
        } else {
          return response.json();
        }
      })
      .then((response) => {
        var summary = {
          publicRepositories: response.public_repos,
          email: response.email,
          company: response.company,
        };
        return summary;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Update the user interface with the user summary information
  const updateUserSummary = (userSummary) => {
    const userSummaryContainer = document.getElementById(
      "user-summary-container"
    );

    if (userSummary == null) {
      showError("Record Not found");
      return;
    }

    userSummaryContainer.textContent = "";

    // Create the table element
    let table = document.createElement("table");

    // Create the header element
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    let th = document.createElement("th");
    th.innerText = "Github Attribute";

    // Add CSS Style to table
    th.style.textAlign = "left";
    th.style.padding = "8px";
    th.style.borderBottom = "1px solid #ddd";
    tr.appendChild(th);

    th = document.createElement("th");
    th.innerText = "Github Value";
    tr.appendChild(th);

    // Add CSS Style color to table row
    tr.style.backgroundColor = "wheat";

    thead.appendChild(tr);
    table.append(tr);

    // Loop through the JSON data and create table rows
    for (item in userSummary) {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      // Set the value as the text of the table cell
      td.innerText = item;

      // Add CSS Style color to table data
      td.style.textAlign = "left";
      td.style.padding = "8px";
      td.style.borderBottom = "1px solid #ddd";

      tr.appendChild(td);
      td = document.createElement("td");
      // Set the value Not Available if it is null
      td.innerText = userSummary[item] || "Not Available";

      // Add CSS Style color to table data
      td.style.textAlign = "left";
      td.style.padding = "8px";
      td.style.borderBottom = "1px solid #ddd";

      tr.appendChild(td);
      table.appendChild(tr);
    }
    // Add CSS Style color to table data
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    userSummaryContainer.appendChild(table);
  };

  function showError(message) {
    const errorContainer = document.getElementById("user-summary-container");
    errorContainer.textContent = message;
  }
});