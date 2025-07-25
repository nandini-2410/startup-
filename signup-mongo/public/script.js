
       window.onload = function () {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      alert("⚠️ You must be signed in to access this page.");
      window.location.href = 'signin.html';
    }
  };

document.getElementById("suggestBtn").addEventListener("click", async () => {
  const domain = document.getElementById("domain").value.toLowerCase();
  const funding = parseInt(document.getElementById("funding").value);

  if (funding < 100000) {
    alert("Please enter funding of at least ₹100000 (1L)");
    return;
  }

  const res = await fetch("/get-startups");
  const data = await res.json();

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // clear previous

   const filtered = data.filter(
    (s) =>
      s.domain.toLowerCase() === domain &&
      Number(s.minFunding) >= 100000 &&
      Number(s.minFunding) < funding
  );

  

  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<p>No matching startups found.</p>";
    return;
  }

  filtered.forEach((startup) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <h3>${startup.name}</h3>
      <p><strong>Domain:</strong> ${startup.domain}</p>
      <p><strong>Description:</strong> ${startup.description}</p>
      <p><strong>Min Funding:</strong> ₹${startup.minFunding}</p>
    `;
    card.style.border = "1px solid #ccc";
    card.style.margin = "10px";
    card.style.padding = "10px";
    resultsDiv.appendChild(card);
  });
});
