export const paymentConfig = {
  enableRazorpay: true, // show/hide the online payment button
  enableUpi: true, // show/hide the UPI option
  enableBankTransfer: true, // show/hide the bank transfer option
  upi: {
    upiId: "9713103152@upi",
    payeeName: "Nexvanta.AI",
    qrImage: "",
  },
  bank: {
    accountHolderName: "", // Owner will fill in real bank details
    bankName: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    accountType: "", // Current / Savings
  },
  instructions: "After paying, submit your transaction/UTR number so we can confirm your order.",
  supportEmail: "hello.nexvanta56@gmail.com",
  supportWhatsApp: "919713103152",
};
