import { Required } from "@/misc";

export class PierSolidStruct{
  h = new Required<number>('pier height');
  l = new Required<number>('pier section length(cross view)');
  w = new Required<number>('pier section width(along view)');
  fr = new Required<number>('pier fillet radius');
  topBeam = new TopBeam();
  found = new Found();
}

class TopBeam{
  h = new Required<number>('pier top beam height');
  w = new Required<number>('pier top beam width(along view)');
  l = new Required<number>('pier top beam length(cross view)');
}

class Found{
  h = new Required<number>('pier foundation height');
  w = new Required<number>('pier foundation width(along view)');
  l = new Required<number>('pier foundation length(cross view)');
}