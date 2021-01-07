import { item } from "@/struct/RebarBuilder";
import { UShellCompositeRebarBuilder } from "../../UShellRebar";
import { RebarInBar } from "./bar";
import { RebarInEnd } from "./end";
import { RebarInShell } from "./shell";

export class RebarInUShell extends UShellCompositeRebarBuilder {
  shell = item(RebarInShell, this);
  end = item(RebarInEnd, this);
  bar = item(RebarInBar, this);
}
