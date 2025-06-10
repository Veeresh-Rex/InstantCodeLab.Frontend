import { LanguageCode } from "@/constant/enums";

export interface CompileRequestDto {
  code: string;
  stdinInput: string;
  language: LanguageCode;
}

export interface CompileResponseDto {
  output: string;
  isError: boolean;
}