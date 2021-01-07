import { item } from "@/struct/RebarBuilder";
import { UShellCompositeRebarBuilder } from "../../../UShellRebar";
import { MainBar } from "./MainBar";
import { StirBar } from "./StirBar";

export class RebarInBar extends UShellCompositeRebarBuilder{
  name = '拉杆'
  main = item(MainBar, this);
  stir = item(StirBar, this);
}