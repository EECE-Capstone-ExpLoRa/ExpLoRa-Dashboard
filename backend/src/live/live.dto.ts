import { IsNotEmpty } from "class-validator";

export class LiveDto {
  @IsNotEmpty()
  data: string;
}