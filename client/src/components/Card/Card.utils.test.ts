import { describe, it, expect } from "vitest";
import { createIconTransformComputer } from "./Card.utils";

describe("createIconTransformComputer", () => {
  describe("with 8 icons", () => {
    const computeTransform = createIconTransformComputer(8);
    const mockTransforms = {
      scales: [1, 0.8, 0.9, 1.1, 0.7, 0.85, 0.95, 1.05],
      rotations: ["45deg", "90deg", "135deg", "180deg", "225deg", "270deg", "315deg", "360deg"],
    };

    it("returns transform for center icon (index 0)", () => {
      const result = computeTransform(0, mockTransforms);
      expect(result.transform).toContain("rotate(0deg)");
      expect(result.transform).not.toContain("translate(220%)");
      expect(result.transform).toContain("scale(1)");
    });

    it("returns transform with translation for outer icons", () => {
      const result = computeTransform(1, mockTransforms);
      expect(result.transform).toContain("translate(220%)");
    });

    it("calculates correct base rotation for each icon", () => {
      // Base rotation = (360 / 7) * index
      const result2 = computeTransform(2, mockTransforms);
      const expectedRotation = (360 / 7) * 2;
      expect(result2.transform).toContain(`rotate(${expectedRotation}deg)`);
    });

    it("applies scale from transforms", () => {
      const result = computeTransform(3, mockTransforms);
      expect(result.transform).toContain("scale(1.1)");
    });

    it("applies rotation from transforms", () => {
      const result = computeTransform(2, mockTransforms);
      expect(result.transform).toContain("rotate(135deg)");
    });
  });

  describe("with unsupported icon count", () => {
    it("returns empty object for unsupported count", () => {
      const computeTransform = createIconTransformComputer(6 as 8);
      const result = computeTransform(0, { scales: [], rotations: [] });
      expect(result).toEqual({});
    });
  });
});
