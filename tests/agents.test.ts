import { describe, it, expect } from "vitest";
import { agents } from "../data/agents";

describe("30 AI Agents Data Verification", () => {
  it("has exactly 30 agents", () => {
    expect(agents).toHaveLength(30);
  });

  it("matches sample row 1 (AI WhatsApp Receptionist)", () => {
    const row1 = agents.find((a) => a.id === 1);
    expect(row1).toBeDefined();
    expect(row1?.name).toBe("AI WhatsApp Receptionist");
    expect(row1?.specificIndustry).toBe("Clinics, salons, restaurants, gyms, real estate");
    expect(row1?.subscription).toBe(8000);
    expect(row1?.setup).toBe(20000);
    expect(row1?.maintenance).toBe(5000);
  });

  it("matches sample row 8 (AI Voice Sales Agent)", () => {
    const row8 = agents.find((a) => a.id === 8);
    expect(row8).toBeDefined();
    expect(row8?.name).toBe("AI Voice Sales Agent");
    expect(row8?.specificIndustry).toBe("Real estate, automotive, insurance, B2B");
    expect(row8?.subscription).toBe(25000);
    expect(row8?.setup).toBe(50000);
    expect(row8?.maintenance).toBe(12500);
  });

  it("matches sample row 13 (AI Voice + WhatsApp Lead Conversion Agent)", () => {
    const row13 = agents.find((a) => a.id === 13);
    expect(row13).toBeDefined();
    expect(row13?.name).toBe("AI Voice + WhatsApp Lead Conversion Agent");
    expect(row13?.specificIndustry).toBe("Real estate, coaching, dealerships, agencies");
    expect(row13?.subscription).toBe(30000);
    expect(row13?.setup).toBe(75000);
    expect(row13?.maintenance).toBe(18000);
  });

  it("matches sample row 20 (AI Restaurant Receptionist)", () => {
    const row20 = agents.find((a) => a.id === 20);
    expect(row20).toBeDefined();
    expect(row20?.name).toBe("AI Restaurant Receptionist");
    expect(row20?.specificIndustry).toBe("Restaurants, cafes, cloud kitchens");
    expect(row20?.subscription).toBe(12000);
    expect(row20?.setup).toBe(30000);
    expect(row20?.maintenance).toBe(8000);
  });

  it("matches sample row 30 (AI Business Operations Agent)", () => {
    const row30 = agents.find((a) => a.id === 30);
    expect(row30).toBeDefined();
    expect(row30?.name).toBe("AI Business Operations Agent");
    expect(row30?.specificIndustry).toBe("SMEs, agencies, multi-location businesses");
    expect(row30?.subscription).toBe(25000);
    expect(row30?.setup).toBe(60000);
    expect(row30?.maintenance).toBe(15000);
  });
});
