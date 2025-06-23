import { LanguageCode } from './enums';

export const mapToMonacoLanguage = (lang: LanguageCode): string => {
  const mapping: Record<LanguageCode, string> = {
    [LanguageCode.Java]: 'java',
    [LanguageCode.Bash]: 'shell',
    [LanguageCode.C]: 'c',
    [LanguageCode.CSharp]: 'csharp',
    [LanguageCode.Cpp17]: 'cpp',
    [LanguageCode.Go]: 'go',
    [LanguageCode.NodeJs]: 'javascript',
    [LanguageCode.Python3]: 'python',
    [LanguageCode.Sql]: 'sql',
  };

  return mapping[lang];
};
