async function testLiveWebhook() {
  const url = "https://script.google.com/macros/s/AKfycbyJc2IB_7Ql95MEWKXzmCdWF--P76xyaz7ea1M8Th6PJJS6XuyFQgvKrtV2M8jGQbiOuw/exec";

  console.log("=== 1. SENDING CONTACT FORM TEST LEAD TO GOOGLE SHEET ===");
  const payload1 = {
    secret: "nx_crm_secret_nexvanta2026",
    name: "Shubham (Live Verification)",
    phone: "+919713103152",
    email: "hello.nexvanta56@gmail.com",
    company: "Nexvanta.AI",
    industry: "AI Automation",
    status: "HOT",
    segment: "Service",
    interestedIn: "AI WhatsApp Receptionist",
    source: "Contact Form",
    message: "Live Google Sheet CRM integration verified successfully! Testing automatic email notification.",
    pageUrl: "https://nexvanta.ai/contact"
  };

  try {
    const res1 = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload1),
      redirect: "follow"
    });
    const data1 = await res1.json();
    console.log("Contact Form Lead Result:", data1);

    console.log("\n=== 2. SENDING INITIAL CHATBOT LEAD (Phone captured) ===");
    const payload2 = {
      secret: "nx_crm_secret_nexvanta2026",
      name: "Aman Chatbot Test",
      phone: "+919713103152",
      industry: "Real estate",
      status: "WARM",
      segment: "Service",
      interestedIn: "AI Lead Qualification Agent",
      source: "Chatbot Flow",
      message: "Captured via Chatbot. Looking for: AI agents for real estate",
      pageUrl: "https://nexvanta.ai/services"
    };

    const res2 = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload2),
      redirect: "follow"
    });
    const data2 = await res2.json();
    console.log("Chatbot Initial Lead Result:", data2);

    console.log("\n=== 3. SENDING CHATBOT UPDATE WITH SAME LEAD ID (Should update row in-place) ===");
    const payload3 = {
      secret: "nx_crm_secret_nexvanta2026",
      leadId: data2.leadId,
      name: "Aman Chatbot Test",
      phone: "+919713103152",
      email: "hello.nexvanta56@gmail.com",
      company: "Apex Real Estate Builders",
      industry: "Real estate",
      status: "HOT",
      segment: "Service",
      interestedIn: "AI Lead Qualification Agent",
      source: "Chatbot Completed",
      message: "Chatbot flow completed: Customer requested high volume sales qualification.",
      pageUrl: "https://nexvanta.ai/services"
    };

    const res3 = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload3),
      redirect: "follow"
    });
    const data3 = await res3.json();
    console.log("Chatbot Update Result:", data3);
    console.log("Row Updated Successfully?:", data3.updated === true);

  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testLiveWebhook();
