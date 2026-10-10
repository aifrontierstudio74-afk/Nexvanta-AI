async function testLeads() {
  console.log("=== 1. TESTING CONTACT FORM LEAD ===");
  const contactRes = await fetch("http://localhost:3000/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Rahul Test",
      phone: "9713103152",
      email: "hello.nexvanta56@gmail.com",
      company: "Nexvanta Tech",
      industry: "Real estate",
      interestedIn: "Service-Based AI Agents",
      segment: "Service",
      source: "Contact Form",
      message: "Testing Contact Form CRM integration",
      consent: true,
      submissionDurationMs: 3500
    })
  });
  const contactData = await contactRes.json();
  console.log("Contact Form Result:", contactData);

  console.log("\n=== 2. TESTING CHATBOT INITIAL LEAD (Phone captured) ===");
  const chat1Res = await fetch("http://localhost:3000/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Chatbot Test User",
      phone: "9713103152",
      industry: "Clinics & Healthcare",
      interestedIn: "AI WhatsApp Receptionist",
      segment: "Service",
      source: "Chatbot Flow",
      message: "Captured via Chatbot. Looking for: AI agents for my industry",
      consent: true
    })
  });
  const chat1Data = await chat1Res.json();
  console.log("Chatbot Step 1 Result:", chat1Data);

  console.log("\n=== 3. TESTING CHATBOT LEAD UPDATE (Same leadId, email & company added) ===");
  const chat2Res = await fetch("http://localhost:3000/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      leadId: chat1Data.leadId,
      name: "Chatbot Test User",
      phone: "9713103152",
      email: "hello.nexvanta56@gmail.com",
      company: "Apex Care Clinic",
      industry: "Clinics & Healthcare",
      interestedIn: "AI WhatsApp Receptionist",
      segment: "Service",
      source: "Chatbot Completed",
      message: "Completed full chatbot flow. Industry: Clinics & Healthcare",
      consent: true
    })
  });
  const chat2Data = await chat2Res.json();
  console.log("Chatbot Step 2 (Update) Result:", chat2Data);
  console.log("Did leadId stay identical?", chat1Data.leadId === chat2Data.leadId);
}

testLeads();
