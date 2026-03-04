async function main() {
    try {
      console.log("Sending request...");
  
      const res = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "I love learning to code!" })
      });
  
      console.log("Status:", res.status); // should be 200
  
      const data = await res.json();
      console.log("Result:", JSON.stringify(data, null, 2));
  
    } catch (err) {
      console.error("Error:", err.message);
    }
  }
  
  main();
