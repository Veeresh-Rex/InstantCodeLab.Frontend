import { LanguageCode } from "./enums";
export const languages = [
  {
    key: 'Javascript',
    label: 'Javascript',
  },
  {
    key: 'Csharp',
    label: 'C#',
  },
  {
    key: 'Python',
    label: 'Python',
  },
  {
    key: 'Java',
    label: 'Java',
  },
];

export const mapToMonacoLanguage = (lang: LanguageCode): string => {
  const mapping: Record<LanguageCode, string> = {
    [LanguageCode.Java]: 'java',
    [LanguageCode.Bash]: 'shell',
    [LanguageCode.C]: 'c',
    [LanguageCode.CSharp]: 'csharp',
    [LanguageCode.Cpp17]: 'cpp',
    [LanguageCode.Dart]: 'dart',
    [LanguageCode.Go]: 'go',
    [LanguageCode.Kotlin]: 'kotlin',
    [LanguageCode.NodeJs]: 'javascript',
    [LanguageCode.Python3]: 'python',
    [LanguageCode.Ruby]: 'ruby',
    [LanguageCode.Rust]: 'rust',
    [LanguageCode.Sql]: 'sql',
    [LanguageCode.TypeScript]: 'typescript',
  };

  return mapping[lang];
};
