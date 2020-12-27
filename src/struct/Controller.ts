import {
  Builder,
  DrawItem,
  HydroA1Builder,
  HydroA2Builder,
  HydroA3Builder,
  HydroBorderBuilder,
} from "@/draw";

export abstract class Controller implements Builder<DrawItem[]> {
  abstract generate(): DrawItem[];
  company?: string;
  project?: string;
  design?: string;
  section?: string;
  drawingTitle?: string;
  drawingNumberPrefix?: string;
  drawingNumberStart?: number;
  certificateNumber?: string;
  note: string[] = [];
  protected genBorder(size: "A1" | "A2" | "A3" = "A1"): HydroBorderBuilder {
    let border: HydroBorderBuilder;
    if (size === "A1") {
      border = new HydroA1Builder();
    } else if (size === "A2") {
      border = new HydroA2Builder();
    } else {
      border = new HydroA3Builder();
    }

    if (this.company) border.company = this.company;
    if (this.project) border.project = this.project;
    if (this.design) border.design = this.design;
    if (this.section) border.section = this.section;
    if (this.drawingTitle) border.drawingTitle = this.drawingTitle;
    if (this.drawingNumberPrefix) border.drawingNumberPrefix = this.drawingNumberPrefix;
    if (this.drawingNumberStart) border.drawingNumberStart = this.drawingNumberStart;
    if (this.certificateNumber)
      border.certificateNumber = this.certificateNumber;
    const date = new Date();
    border.date = `${date.getFullYear()}.${date.getMonth() + 1}`;

    border.note = this.note;
    return border;
  }
}
